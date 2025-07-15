// src/reducers/anecdoteReducer.js
import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'


const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {

    updateVote(state, action) {
      const updatedVote = action.payload
      return state
        .map(anecdote => anecdote.id !== updatedVote.id ? anecdote : updatedVote)
        .sort((a, b) => b.votes - a.votes)
    },
    /**voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)
      if (anecdoteToVote) {
        anecdoteToVote.votes = anecdoteToVote.votes + 1
      }
      state.sort((a, b) => b.votes - a.votes)
    },**/

    appendAnecdote(state, action) {
      state.push(action.payload)
      state.sort((a, b) => b.votes - a.votes)
    },

    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const updatedObject = { ...anecdote, votes: anecdote.votes + 1 }
    const updatedAnecdote = await anecdoteService.updateVotes(anecdote.id, updatedObject)
    dispatch(updateVote(updatedAnecdote))
  }
}

export const { updateVote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
    
export default anecdoteSlice.reducer