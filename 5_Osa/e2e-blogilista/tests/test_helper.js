// 5_Osa/e2e-blogilista/tests/test_helper.js
const { expect } = require('@playwright/test')

const createBlog = async (page, { title, author, url }) => {
    await page.getByRole('button', { name: 'create a new blog' }).click()
    await page.getByPlaceholder('write title here').fill(title)
    await page.getByPlaceholder('write author here').fill(author)
    await page.getByPlaceholder('write url here').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await expect(page.locator('.notificationGood')).toBeVisible()
    await expect(page.locator('.notificationGood')).not.toBeVisible()
}

module.exports = {
    createBlog
}