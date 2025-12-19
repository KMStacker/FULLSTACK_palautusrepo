import { useState } from 'react'
import { gql, useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries'
import Select from 'react-select'

const Authors = (props) => {
  
  const [born, setBorn] = useState('')
  const [selectedOption, setSelectedOption] = useState(null)

  const result = useQuery(ALL_AUTHORS)

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }


  if (result.loading) {
    return <div>loading...</div>
  }

  const authors = result.data.allAuthors

  const options = authors.map(a => ({
    value: a.name,
    label: a.name
  }))

  const submit = async (event) => {
    event.preventDefault()

    if (!selectedOption) {
      return
    }

    console.log('update author...')

    editAuthor({
      variables: {
        name: selectedOption.value,
        setBornTo: parseInt(born)
      }
    })

    setSelectedOption(null)
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          name
          <Select
            value={selectedOption}
            onChange={setSelectedOption}
            options={options}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
