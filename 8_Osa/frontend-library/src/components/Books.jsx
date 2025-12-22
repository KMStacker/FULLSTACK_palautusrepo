import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  
  const result = useQuery(ALL_BOOKS)
  const [filter, setFilter] = useState(null)

  const filteredResult = useQuery(ALL_BOOKS, {
    variables: { genre: filter },
    fetchPolicy: "cache-and-network",
  })


  if (!props.show) {
    return null
  }

  if (result.loading || filteredResult.loading) {
    return <div>loading...</div>
  }
  
  if (result.error) {
    console.log(result.error)
    return <div>Error: {result.error.message}</div>
  }
  
  if (filteredResult.error) {
    console.log(filteredResult.error)
    return <div>Error: {filteredResult.error.message}</div>
  }

  const books = result.data.allBooks

  const genres = [...new Set(books.flatMap(b => b.genres))].filter(g => g)

  const booksToShow = filteredResult.data.allBooks

  return (
    <div>
      <h2>books</h2>
      {filter && (<p>in genre <strong>{filter}</strong></p>)}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(g => (
          <button key={g} onClick={() => setFilter(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setFilter(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books