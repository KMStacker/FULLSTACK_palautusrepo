import { useState, useEffect } from 'react'
import axios from 'axios'


export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(res => {
        setResources(res.data)
      })
      .catch(error => {
        console.error(`problem getting data from: ${baseUrl}`, error)
      })
  }, [baseUrl])

  const create = (resource) => {
    return axios.post(baseUrl, resource)
      .then(res => {
        setResources(prevState => prevState.concat(res.data))
        return res.data
      })
      .catch(error => {
        console.error(`problem posting data to: ${baseUrl}`, error)
      })
  }

  const service = {
    create
  }

  return [
    resources, service
  ]
}