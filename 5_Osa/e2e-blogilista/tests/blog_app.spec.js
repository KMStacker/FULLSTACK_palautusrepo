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

  test('Login form can be opened and after click is shown', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'log in' })
    await expect(loginButton).toBeVisible()

    await loginButton.click()
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
  })

  describe('Login', () => {
    beforeEach(async ({ page }) => {
      const loginButton = page.getByRole('button', { name: 'log in' })
      await loginButton.click()
    })

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
      //await expect(page.getByText('Wrong credentials')).toBeVisible()
    })
  })
})