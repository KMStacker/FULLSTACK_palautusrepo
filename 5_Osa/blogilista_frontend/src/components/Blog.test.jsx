// src/components/Blog.test.jsx
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test, vitest } from 'vitest'

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
    user: { name: 'user test' }
  }

  const mockHandler = vitest.fn()

  render(<Blog blog={blog} toggleVisibility={mockHandler} />)

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