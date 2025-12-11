import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import storage from "../services/storage";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    clearUser() {
      return null
    }
  }
});

export const { setUser, clearUser } = userSlice.actions

export const loginUser = (credentials) => {
  return async dispatch => {
    const user = await loginService.login(credentials)
    storage.saveUser(user)
    dispatch(setUser(user))
  }
}

export const logoutUser = () => {
  return async dispatch => {
    storage.removeUser()
    dispatch(clearUser())
  }
}

export const checkLoggedUser = () => {
  return async dispatch => {
    const user = storage.loadUser()
    if (user) {
      dispatch(setUser(user))
    }
  }
}

export default userSlice.reducer