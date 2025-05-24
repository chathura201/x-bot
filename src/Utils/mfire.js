const puppeteer = require("puppeteer");
async function scrapeMediafire(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Set a user agent to simulate a real browser
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
  );

  try {
    // Navigate to the MediaFire page
    await page.goto(url, { waitUntil: "networkidle2" });

    // Wait for the download button to appear
    await page.waitForSelector('a[aria-label="Download file"]', {
      timeout: 10000,
    });

    // Extract the direct download link
    const downloadLink = await page.evaluate(() => {
      const downloadButton = document.querySelector(
        'a[aria-label="Download file"]'
      );
      return downloadButton ? downloadButton.href : null;
    });

    await browser.close();

    if (downloadLink) {
      return downloadLink;
    } else {
      console.log("Download link not found.");
      return null;
    }
  } catch (error) {
    console.error("Error:", error.message);
    await browser.close();
    return null;
  }
}

module.exports = scrapeMediafire;