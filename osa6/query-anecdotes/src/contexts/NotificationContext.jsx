import { createContext, useState, useContext } from 'react'

const NotificationContext = createContext()

let timeoutId = null

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState('')

  const showNotification = (message, duration = 5) => {
    if (timeoutId) clearTimeout(timeoutId)
    setNotification(message)
    timeoutId = setTimeout(() => {
      setNotification('')
      timeoutId = null
    }, duration * 1000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotify = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotify must be used within NotificationProvider')
  }
  return context
}