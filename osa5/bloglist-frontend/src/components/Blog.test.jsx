import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    id: '1',
    title: 'Component testing',
    author: 'Tester',
    url: 'https://example.com',
    likes: 5,
    user: { username: 'testuser', name: 'Tester' }
  }

  test('renders title and author but not url or likes when logged out', () => {
    render(<Blog blog={blog} user={null} updateBlog={vi.fn()} removeBlog={vi.fn()} />)
    expect(screen.getByText('Component testing Tester')).toBeDefined()
    expect(screen.queryByText('https://example.com')).toBeNull()
    expect(screen.queryByText('likes 5')).toBeNull()
  })

  test('renders url and likes when expanded', async () => {
    const user = userEvent.setup()
    render(<Blog blog={blog} user={{ username: 'other' }} updateBlog={vi.fn()} removeBlog={vi.fn()} />)
    const viewButton = screen.getByText('view')
    await user.click(viewButton)
    expect(screen.getByText('https://example.com')).toBeDefined()
    expect(screen.getByText('likes 5')).toBeDefined()
    expect(screen.getByText('like')).toBeDefined()
    expect(screen.queryByText('delete')).toBeNull()
  })

  test('shows delete button for creator', async () => {
    const user = userEvent.setup()
    render(<Blog blog={blog} user={{ username: 'testuser' }} updateBlog={vi.fn()} removeBlog={vi.fn()} />)
    await user.click(screen.getByText('view'))
    expect(screen.getByText('delete')).toBeDefined()
  })

  test('clicking like button twice calls updateBlog twice', async () => {
    const mockUpdate = vi.fn()
    const user = userEvent.setup()
    render(<Blog blog={blog} user={{ username: 'testuser' }} updateBlog={mockUpdate} removeBlog={vi.fn()} />)
    await user.click(screen.getByText('view'))
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockUpdate.mock.calls).toHaveLength(2)
  })
})