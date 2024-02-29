const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

require('dotenv').config();
// const secretValue = process.env.DEFAULT_EMAIL;
// console.log(secretValue);
const password = process.env.DEFAULT_PW;
const email = process.env.DEFAULT_EMAIL;

var webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
By = webdriver.By;

// Enable all CORS requests
app.use(cors());

async function scrapeWebsite(what) {
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
	console.log(what);
	let output = 'balls';
	if (what == 'table') {
		// Get and return the table
		let table = await driver.findElement(By.className('table'));
		output = await table.getAttribute('outerHTML');
	} else if (what == 'time') {
		// Get time of last update
		output = await driver.findElement(By.xpath('/html/body/div/div[2]/div/div[2]')).getText();
	}
	console.log(output);
	// Close the WebDriver
	await driver.quit();
	return output;
}

// put the table into the response
app.get('/table', async (req, res) => {
	try {
		let htmlString = await scrapeWebsite('table');
		res.send(htmlString);
		console.log(htmlString);
	} catch (error) {
		console.error('Error scraping website:', error);
		res.status(500).send('Error scraping website');
	}
});
app.get('/time', async (req, res) => {
	try {
		let time = await scrapeWebsite('time');
		res.send(time);
	} catch (error) {
		console.error('Error scraping website:', error);
		res.status(500).send('Error scraping website');
	}
});

// Give a message to the user
app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
