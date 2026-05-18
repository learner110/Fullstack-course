import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls createBlog with correct data when new blog is created', async () => {
    const mockCreateBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={mockCreateBlog} />)

    const titleInput = screen.getByPlaceholderText('title') || screen.getByLabelText('title:')
    const authorInput = screen.getByPlaceholderText('author') || screen.getByLabelText('author:')
    const urlInput = screen.getByPlaceholderText('url') || screen.getByLabelText('url:')
    const createButton = screen.getByText('create')

    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'https://test.com')
    await user.click(createButton)

    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'https://test.com'
    })
  })
})