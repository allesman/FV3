const express = require('express');
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const app = express();
const port = 3001;

async function scrapeWebsite() {
  const driver = await new Builder()
    .forBrowser('chrome')
    // .setChromeOptions(new chrome.Options().headless()) // Optional: Run headless if desired
    .build();

  try {
    await driver.get('https://google.com'); // Replace with the URL you want to scrape

    // Perform scraping using Selenium functions
    const scrapedData =
    // await driver.findElements(By.css('your-css-selector'));
    // Extract the necessary data and format it as needed

    // return scrapedData.map(item => ({ name: item.getText() }));
    return driver.getTitle();
  } finally {
    await driver.quit();
  }
}

app.get('/api/scrape', async (req, res) => {
  try {
    const scrapedData = await scrapeWebsite();
    res.json(scrapedData);
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
