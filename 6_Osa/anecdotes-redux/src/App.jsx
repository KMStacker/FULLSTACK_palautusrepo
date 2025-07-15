// src/App.jsx
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteReducer'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch]) // dispatch called only once anyway so could be also []

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification /> &nbsp;
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App