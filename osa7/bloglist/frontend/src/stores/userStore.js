import { create } from 'zustand'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { useNotificationStore } from './notificationStore'
import { useBlogStore } from './blogStore'

export const useUserStore = create((set, get) => ({
  user: null,

  setUser: (user) => {
    set({ user })
    if (user) {
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    } else {
      blogService.setToken(null)
      window.localStorage.removeItem('loggedBlogappUser')
    }
  },

  login: async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      get().setUser(user)
      useNotificationStore.getState().showNotification('Login successful')
      await useBlogStore.getState().initializeBlogs(user.token)
      return true
    } catch (error) {
      useNotificationStore.getState().showNotification('wrong username or password', 'error')
      return false
    }
  },

  logout: () => {
    get().setUser(null)
    useNotificationStore.getState().showNotification('Logged out')
  },
}))