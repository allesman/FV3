const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

let htmlString = ''; // This will hold your HTML string

var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;



const password = "WdNnE1969!";
const email = "julia.rehbinder@gmail.com";

// Enable all CORS requests
app.use(cors());

async function scrapeWebsite() {
    var driver = new webdriver.Builder()
    .forBrowser('chrome')
    .build();
    // opens the website and enters email
    await driver.get('https://prmpul.eltern-portal.org');

    // enters email
    await driver.findElement(By.id("inputEmail")).sendKeys(email);

    // enters password
    await driver.findElement(By.id("inputPassword")).sendKeys(password);

    // Clicks submit button
    await driver.findElement(By.xpath("//button[@type='submit']")).click();

    // Navigates to another page
    await driver.get("https://prmpul.eltern-portal.org/service/vertretungsplan");

     // Get the table
    let table = await driver.findElement(By.className("table"));
     htmlString = await table.getAttribute('outerHTML'); // Update htmlString

    console.log(htmlString);
    // Close the WebDriver
    await driver.quit();

}

// scrapeWebsite();

app.get('/table', async (req, res) => {
    try {
        await scrapeWebsite();
        console.log('Sending HTML:', htmlString);
        res.send(htmlString);
    } catch (error) {
        console.error('Error scraping website:', error);
        res.status(500).send('Error scraping website');
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});