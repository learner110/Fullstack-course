export const loginWith = async (page, username, password) => {
  await page.locator('button:has-text("login")').click()
  await page.waitForSelector('form')
  await page.getByRole('textbox', { name: 'username' }).fill(username)
  await page.getByLabel('password').fill(password)
  await page.locator('button:has-text("login")').click()
}

export const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'create new' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${title} ${author}`).waitFor()
}