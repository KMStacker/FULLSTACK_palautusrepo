// src/reducers/notificationReducer.js
import { createSlice } from '@reduxjs/toolkit'

const notificationReducer = createSlice({
  name: 'notification',
  initialState: 'halojata halloo',
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
    hideNotification() {
      return null
    }
  }
})

export const { showNotification, hideNotification } = notificationReducer.actions

export const setNotification = (text, time) => {
  return async dispatch => {
    dispatch(showNotification(text))
    setTimeout(() => {
      dispatch(hideNotification())
    }, time * 1000)
  }
}

export default notificationReducer.reducer