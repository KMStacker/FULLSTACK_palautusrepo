// src/components/AnecdoteList.jsx
import { useSelector, useDispatch } from "react-redux"
import { voteAnecdote } from "../reducers/anecdoteReducer"
import {setNotification} from "../reducers/notificationReducer"

const AnecdoteList = () => {

  const anecdotes = useSelector(state => {
    if (state.filter === '') {
      return state.anecdotes //[...state.anecdotes].sort((a, b) => b.votes - a.votes)
    }
    return state.anecdotes
      .filter(anecdote =>
        anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
      )
      //.sort((a, b) => b.votes - a.votes)
  })

  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setNotification(`You just clicked vote on: '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote => 
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
      )}
    </div>
  )
}

export default AnecdoteList