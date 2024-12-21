const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const puppeteer = require("puppeteer");
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to handle login and scraping
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        // Launch Puppeteer with a custom executable path for Chromium
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--single-process",
                "--disable-gpu",
                "--disable-software-rasterizer", // additional flag
            ],
            executablePath: process.env.CHROME_BIN || puppeteer.executablePath(), // Use Puppeteer's bundled Chromium
        });

        // ...existing code for scraping...

        await browser.close();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to scrape attendance data." });
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/erp/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/erp/build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});