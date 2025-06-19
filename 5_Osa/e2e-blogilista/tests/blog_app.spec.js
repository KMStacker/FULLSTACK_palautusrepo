// e2e-blogilista/tests/blog_app.spec.js
const { test, expect, beforeEach, describe } = require('@playwright/test')
const { before } = require('node:test')
const {createBlog } = require('./test_helper')

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
      await page.waitForSelector('.notificationBad', { state: 'detached' })
    })
  })

  // 5.19
  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
    await page.getByTestId('username').fill('mluukkai')
    await page.getByTestId('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      const blogDetails = {
        title: 'test title',
        author: 'test author',
        url: 'test url'
      }
      //create a blog
      await createBlog(page, blogDetails)

      // check if blog is in the list
      await expect(page.getByText(`${blogDetails.title} ${blogDetails.author}`)).toBeVisible()
    })

    // 5.20
    test('blog can be liked', async ({ page }) => {
      const blogDetails = {
        title: 'test title',
        author: 'test author',
        url: 'test url'
      }
      //create a blog
      await createBlog(page, blogDetails)

      // check if blog is in the list
      await expect(page.getByText(`${blogDetails.title} ${blogDetails.author}`)).toBeVisible()

      // click a correct view button
      const locator = page.locator('.blog-style', { hasText: `${blogDetails.title} ${blogDetails.author}` })
      await locator.getByRole('button', { name: 'view' }).click()
      
      // check likes
      await expect(locator.getByText('0 likes')).toBeVisible()

      // click like button
      await locator.getByRole('button', { name: 'like' }).click()

      // check new likes
      await expect(locator.getByText(/1 like/)).toBeVisible()
    })

    // 5.21
    test('blog can be removed', async ({ page }) => {
      const blogDetails = {
        title: 'test title',
        author: 'test author',
        url: 'test url'
      }
      //create a blog
      await createBlog(page, blogDetails)

      // check if blog is in the list
      await expect(page.getByText(`${blogDetails.title} ${blogDetails.author}`)).toBeVisible()

      // click a correct view button
      const locator = page.locator('.blog-style', { hasText: `${blogDetails.title} ${blogDetails.author}` })
      await locator.getByRole('button', { name: 'view' }).click()

      // window.confirm before remove click
      page.on('dialog', dialog => dialog.accept())

      // click remove button and check notification
      await locator.getByRole('button', { name: 'remove' }).click()
      await expect(page.locator('.notificationGood')).toBeVisible()
      await page.waitForSelector('.notificationGood', { state: 'detached' })
      
      // check if blog has disapeared
      await expect(locator).not.toBeVisible()    
    })

    // 5.22
    test('remove button visible only for creator', async ({ page }) => {
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
      await page.waitForSelector('.notificationGood', { state: 'detached' })
      // 5.22
      await page.request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Matti Luukkainen_V2',
          username: 'mluukkai_V2',
          password: 'salainen'
        }
      })
      
      // API call to login
      const loginV2User = await page.request.post('http://localhost:3003/api/login', {
        data: {
          username: 'mluukkai_V2',
          password: 'salainen'
        }
      })
      
      // API call to collect token
      const { token } = await loginV2User.json()

      // API calls n stuff to create second blog
      const secondBlogTitle = 'Son from diff Mom'
      await page.request.post('http://localhost:3003/api/blogs', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: {
          title: secondBlogTitle,
          author: 'second author',
          url: 'second.url.com'
        }
      })

      // reloading to make API calls visible to first user
      await page.reload()
      await expect(page.getByText('Son from diff Mom')).toBeVisible()

      // opening first bloginfo and checking if remove button is visible or not
      const locator = page.locator('.blog-style', { hasText: `${title} ${author}` })
      await locator.getByRole('button', { name: 'view' }).click()

      await expect(locator.getByRole('button', { name: 'remove' })).toBeVisible()

      // opening second bloginfo and checking if remove button is visible or not
      const locatorV2 = page.locator('.blog-style', { hasText: `${secondBlogTitle} second author` })
      await locatorV2.getByRole('button', { name: 'view' }).click()

      await expect(locatorV2.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    // 5.23
    test('blogs in like order', async ({ page }) => {

      // create 3 well named new blogs
      await page.getByRole('button', { name: 'create a new blog' }).click()
      await page.getByPlaceholder('write title here').fill('Mid likes')
      await page.getByPlaceholder('write author here').fill('Likes Mid')
      await page.getByPlaceholder('write url here').fill('mid.clicked.like')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator('.notificationGood')).toBeVisible()
      await page.waitForSelector('.notificationGood', { state: 'detached' })

      await page.getByRole('button', { name: 'create a new blog' }).click()
      await page.getByPlaceholder('write title here').fill('Most likes')
      await page.getByPlaceholder('write author here').fill('Likes Most')
      await page.getByPlaceholder('write url here').fill('most.clicked.like')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator('.notificationGood')).toBeVisible();
      await page.waitForSelector('.notificationGood', { state: 'detached' })

      await page.getByRole('button', { name: 'create a new blog' }).click()
      await page.getByPlaceholder('write title here').fill('Low likes')
      await page.getByPlaceholder('write author here').fill('Likes Low')
      await page.getByPlaceholder('write url here').fill('low.clicked.like')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.locator('.notificationGood')).toBeVisible();
      await page.waitForSelector('.notificationGood', { state: 'detached' })

      // locators
      const midLikedLocator = page.locator('.blog-style', { hasText: 'Mid likes Likes Mid' })
      const mostLikedLocator = page.locator('.blog-style', { hasText: 'Most likes Likes Most' })
      const lowLikedLocator = page.locator('.blog-style', { hasText: 'Low likes Likes Low' })

      // click all 3 view buttons
      await lowLikedLocator.getByRole('button', { name: 'view' }).click()
      await midLikedLocator.getByRole('button', { name: 'view' }).click()
      await mostLikedLocator.getByRole('button', { name: 'view' }).click()

      // low liked blog gets 2 likes
      await lowLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(lowLikedLocator.getByText('1 likes')).toBeVisible()
      await lowLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(lowLikedLocator.getByText('2 likes')).toBeVisible()

      // mid liked blog gets 4 likes
      await midLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(midLikedLocator.getByText('1 likes')).toBeVisible()
      await midLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(midLikedLocator.getByText('2 likes')).toBeVisible()
      await midLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(midLikedLocator.getByText('3 likes')).toBeVisible()
      await midLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(midLikedLocator.getByText('4 likes')).toBeVisible()

      // most liked blog gets 6 likes
      await mostLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(mostLikedLocator.getByText('1 likes')).toBeVisible()
      await mostLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(mostLikedLocator.getByText('2 likes')).toBeVisible()
      await mostLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(mostLikedLocator.getByText('3 likes')).toBeVisible()
      await mostLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(mostLikedLocator.getByText('4 likes')).toBeVisible()
      await mostLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(mostLikedLocator.getByText('5 likes')).toBeVisible()
      await mostLikedLocator.getByRole('button', { name: 'like' }).click()
      await expect(mostLikedLocator.getByText('6 likes')).toBeVisible()

      // get all blogs
      const listOfAllBlogs = page.locator('.blog-style')
      await expect(listOfAllBlogs).toHaveCount(3)

      // check if blogs are in like order
      await expect(listOfAllBlogs.nth(0)).toContainText('Most likes Likes Most')
      await expect(listOfAllBlogs.nth(1)).toContainText('Mid likes Likes Mid')
      await expect(listOfAllBlogs.nth(2)).toContainText('Low likes Likes Low')
    })
  })
})