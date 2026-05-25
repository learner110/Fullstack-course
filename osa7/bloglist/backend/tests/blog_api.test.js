const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

let token = null

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  const loginRes = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  token = loginRes.body.token

  const blogs = helper.initialBlogs.map(b => new Blog({ ...b, user: user._id }))
  await Blog.insertMany(blogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('blog has id field', async () => {
  const res = await api.get('/api/blogs')
  expect(res.body[0].id).toBeDefined()
})

test('blog creation succeeds with token', async () => {
  const newBlog = {
    title: 'token blog',
    author: 'me',
    url: 'http://token.com'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogs = await helper.blogsInDb()
  expect(blogs).toHaveLength(helper.initialBlogs.length + 1)
})

test('blog creation fails without token', async () => {
  const newBlog = {
    title: 'fail blog',
    author: 'me',
    url: 'http://fail.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

test('likes default to 0', async () => {
  const newBlog = {
    title: 'no likes',
    author: 'me',
    url: 'http://nolikes.com'
  }

  const res = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)

  expect(res.body.likes).toBe(0)
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'me',
    url: 'http://fail.com'
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('delete succeeds only for creator', async () => {
  const blogs = await helper.blogsInDb()
  const blogToDelete = blogs[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)
})

afterAll(async () => {
  await mongoose.connection.close()
})