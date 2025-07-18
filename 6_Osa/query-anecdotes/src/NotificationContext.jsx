import {createContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return action.payload
    case 'HIDE':
      return ""
    default:
      return state
  }
}

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, "")

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}


export default NotificationContext