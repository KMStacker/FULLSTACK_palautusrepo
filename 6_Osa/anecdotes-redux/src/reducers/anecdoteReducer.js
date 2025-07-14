// src/reducers/anecdoteReducer.js
import { createSlice } from '@reduxjs/toolkit'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {

    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)
      if (anecdoteToVote) {
        anecdoteToVote.votes = anecdoteToVote.votes + 1
      }
      state.sort((a, b) => b.votes - a.votes)
    },

    createAnecdote(state, action) {
      state.push(action.payload)
      state.sort((a, b) => b.votes - a.votes)
    },

    setAnecdotes(state, action) {
      return action.payload
    }
  }
})
export const { voteAnecdote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
    
export default anecdoteSlice.reducer