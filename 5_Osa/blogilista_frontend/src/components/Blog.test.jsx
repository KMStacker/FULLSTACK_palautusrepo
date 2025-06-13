// src/components/Blog.test.jsx
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test, vitest } from 'vitest'
import BlogForm from './BlogForm'

// 5.13
test('renders title and author', () => {
  const blog = {
    title: 'title test',
    author: 'author test',
    url: 'urltest.com',
    likes: 0,
    user: { name: 'user test' }
  }

  render(<Blog blog={blog} />)

  const titleAndAuthor = screen.getByText('title test author test')

  expect(titleAndAuthor).toBeDefined()
})

test('renders not url and likes', () => {
  const blog = {
    title: 'title test',
    author: 'author test',
    url: 'urltest.com',
    likes: 0,
    user: { name: 'user test' }
  }

  render(<Blog blog={blog} />)

  const url = screen.queryByText('urltest.com')
  expect(url).toBeNull()
  const likes = screen.queryByText('0 likes')
  expect(likes).toBeNull()
})

// 5.14
test('all info shown when button clicked', async () => {
  const blog = {
    title: 'title test',
    author: 'author test',
    url: 'urltest.com',
    likes: 0,
    user: { name: 'user test', username: 'username test' }
  }

  render(<Blog blog={blog} user={blog.user} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const url = screen.getByText('urltest.com')
  expect(url).toBeDefined()
  const likes = screen.getByText('0 likes')
  expect(likes).toBeDefined()
  const userName = screen.getByText('user test')
  expect(userName).toBeDefined()
})

// 5.15
test('clicking like twice calls event handler twice', async () => {
  const blog = {
    title: 'title test',
    author: 'author test',
    url: 'urltest.com',
    likes: 0,
    user: { name: 'user test', username: 'username test' }
  }

  const mockHandler = vitest.fn()

  render(<Blog blog={blog} user={blog.user} handleLike={mockHandler} />)

  const user = userEvent.setup()
  const viewbutton = screen.getByText('view')
  await user.click(viewbutton)

  const likebutton = screen.getByText('like')
  await user.click(likebutton)
  await user.click(likebutton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

// 5.16
test('calls handler with right parameters when blog created', async () => {
  const createBlog = vitest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByPlaceholderText('write title here')
  const author = screen.getByPlaceholderText('write author here')
  const url = screen.getByPlaceholderText('write url here')
  const createButton = screen.getByText('create')

  await user.type(title, 'title test')
  await user.type(author, 'author test')
  await user.type(url, 'urltest.com')

  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'title test',
    author: 'author test',
    url: 'urltest.com'
  })
})
