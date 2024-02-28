const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const secretValue = process.env.DEFAULT_EMAIL;
console.log(secretValue);
var webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
By = webdriver.By;

const password = 'WdNnE1969!';
const email = 'julia.rehbinder@gmail.com';

// Enable all CORS requests
app.use(cors());

async function scrapeWebsite() {
	// Set up the WebDriver
	var driver = new webdriver.Builder()
		.forBrowser('chrome')
		.setChromeOptions(new chrome.Options().addArguments('--headless'))
		.build();

	// opens the website and enters email
	await driver.get('https://prmpul.eltern-portal.org');

	// enters email
	await driver.findElement(By.id('inputEmail')).sendKeys(email);

	// enters password
	await driver.findElement(By.id('inputPassword')).sendKeys(password);

	// Clicks submit button
	await driver.findElement(By.xpath("//button[@type='submit']")).click();

	// Navigates to page for Vertretungsplan
	await driver.get('https://prmpul.eltern-portal.org/service/vertretungsplan');

	// Get and return the table
	let table = await driver.findElement(By.className('table'));
	htmlString = await table.getAttribute('outerHTML');
	// Close the WebDriver
	await driver.quit();
	return htmlString;
}

// put the table into the response
app.get('/table', async (req, res) => {
	try {
		let htmlString = await scrapeWebsite();
		res.send(htmlString);
	} catch (error) {
		console.error('Error scraping website:', error);
		res.status(500).send('Error scraping website');
	}
});

// Give a message to the user
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
