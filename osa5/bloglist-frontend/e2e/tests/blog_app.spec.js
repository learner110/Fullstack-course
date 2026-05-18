const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, username, password) => {
  await page.goto('/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible({ timeout: 10000 })
  await expect(page).toHaveURL('http://localhost:5173/')
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'create new' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.getByRole('link', { name: title })).toBeVisible()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })
    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('/login')
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      const errorDiv = page.locator('.MuiAlert-message')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test Blog', 'Test Author', 'https://test.com')
      await expect(page.getByRole('link', { name: 'Test Blog' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable', 'Liker', 'https://like.com')
      await page.getByRole('link', { name: 'Likeable' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('creator can delete a blog', async ({ page }) => {
      await createBlog(page, 'Delete Me', 'Deleter', 'https://delete.me')
      await page.reload()
      await expect(page.getByRole('link', { name: 'Delete Me' })).toBeVisible()
      await page.getByRole('link', { name: 'Delete Me' }).click()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible({ timeout: 10000 })
      const deleteButton = page.getByRole('button', { name: /delete/i })
      await expect(deleteButton).toBeVisible({ timeout: 5000 })
      page.once('dialog', dialog => dialog.accept())
      await deleteButton.click()
      await page.getByRole('link', { name: 'blogs' }).click()
      await expect(page.getByRole('link', { name: 'Delete Me' })).not.toBeVisible({ timeout: 10000 })
    })
  })
})