// e2e-blogilista/tests/blog_app.spec.js
const { test, expect, beforeEach, describe } = require('@playwright/test')
const { before } = require('node:test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })
  
  // 5.17
  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
  })

  // 5.18
  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click() 
  
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByTestId('username').fill('mluukkai')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click() 
      
      await expect(page.locator('.notificationBad')).toBeVisible()
    })
  })

  // 5.19
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      // open add blog form
      await page.getByRole('button', { name: 'create a new blog' }).click()
      
      // create title author and url
      const title = 'test title'
      const author = 'test author'
      const url = 'test url'

      // fill in blog form
      await page.getByPlaceholder('write title here').fill(title)
      await page.getByPlaceholder('write author here').fill(author)
      await page.getByPlaceholder('write url here').fill(url)

      // click create and check notification
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator('.notificationGood')).toBeVisible()

      // check if blog is in the list
      await expect(page.getByText(`${title} ${author}`)).toBeVisible()
    })
  })

})