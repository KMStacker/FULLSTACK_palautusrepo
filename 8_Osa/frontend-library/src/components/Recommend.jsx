import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = (props) => {
  const resultAllBooks = useQuery(ALL_BOOKS)
  const resultMe = useQuery(ME)

  if (!props.show) {
    return null
  }

  if (resultAllBooks.loading || resultMe.loading) {
    return <div>loading...</div>
  }

  const books = resultAllBooks.data.allBooks
  const me = resultMe.data.me

  const booksToShow = books.filter(b => b.genres.includes(me.favoriteGenre))

  return (
    <div>
      <h2>Recommendations</h2>
        <p>books in your favorite genre <strong>{me.favoriteGenre}</strong></p>
        <table>
          <tbody>
            <tr>
              <th>title</th>
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
    </div>
  )
}

export default Recommend