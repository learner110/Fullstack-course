import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { useBlogStore } from './src/stores/blogStore'
import { useUserStore } from './src/stores/userStore'
import { useNotificationStore } from './src/stores/notificationStore'

afterEach(() => {
  cleanup()
  useBlogStore.setState({ blogs: [] })
  useUserStore.setState({ user: null })
  useNotificationStore.setState({ notification: null })
})