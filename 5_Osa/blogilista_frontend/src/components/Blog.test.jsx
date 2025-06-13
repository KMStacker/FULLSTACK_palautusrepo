// src/components/Blog.test.jsx
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test } from 'vitest'

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

  const title = screen.getByText('title test')
  const author = screen.getByText('author test')

  expect(title).toBeDefined()
  expect(author).toBeDefined()
})