import { create } from 'zustand'
import blogService from '../services/blogs'
import { useNotificationStore } from './notificationStore'

export const useBlogStore = create((set, get) => ({
  blogs: [],

  initializeBlogs: async (token) => {
    if (token) blogService.setToken(token)
    const blogs = await blogService.getAll()
    blogs.sort((a, b) => b.likes - a.likes)
    set({ blogs })
  },

  addBlog: async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      set((state) => {
        const newBlogs = [...state.blogs, returnedBlog]
        newBlogs.sort((a, b) => b.likes - a.likes)
        return { blogs: newBlogs }
      })
      useNotificationStore.getState().showNotification(
        `a new blog "${returnedBlog.title}" by ${returnedBlog.author} added`
      )
      return true
    } catch (error) {
      useNotificationStore.getState().showNotification('failed to create blog', 'error')
      return false
    }
  },

  updateBlog: async (updatedBlog) => {
    try {
      const result = await blogService.update(updatedBlog.id, updatedBlog)
      set((state) => {
        const newBlogs = state.blogs.map(blog =>
          blog.id === updatedBlog.id ? result : blog
        )
        newBlogs.sort((a, b) => b.likes - a.likes)
        return { blogs: newBlogs }
      })
    } catch (error) {
      useNotificationStore.getState().showNotification('failed to update blog', 'error')
    }
  },

  removeBlog: async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) return
    try {
      await blogService.remove(blog.id)
      set((state) => ({
        blogs: state.blogs.filter(b => b.id !== blog.id)
      }))
      useNotificationStore.getState().showNotification(`blog "${blog.title}" removed`)
    } catch (error) {
      useNotificationStore.getState().showNotification('failed to delete blog', 'error')
    }
  },
}))