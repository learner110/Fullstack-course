const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(blogs)
})


blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  const user = req.user

  const blog = new Blog({
    ...req.body,
    user: user._id
  })

  const saved = await blog.save()

  user.blogs = user.blogs.concat(saved._id)
  await user.save()

  res.status(201).json(saved)
})


blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)

  if (!blog) return res.status(404).end()

  if (blog.user.toString() !== req.user.id.toString()) {
    return res.status(403).json({ error: 'forbidden' })
  }

  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

module.exports = blogsRouter

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const updatedBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: body.user
  }

  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    updatedBlog,
    { new: true }
  ).populate('user', { username: 1, name: 1 })

  res.json(blog)
})