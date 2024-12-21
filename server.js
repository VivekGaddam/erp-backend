const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Endpoint to fetch both attendance and semester marks data
app.post("/data", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Login and scrape attendance data
        await page.goto("https://erp.cbit.org.in/", { waitUntil: "networkidle2" });

        // Input username and password
        await page.type("#txtUserName", username);
        await page.click("#btnNext");
        await page.waitForSelector("#txtPassword", { visible: true });
        await page.type("#txtPassword", password);

        await Promise.all([
            page.click("#btnSubmit"),
            page.waitForNavigation({ waitUntil: "networkidle2" }),
        ]);

        // Navigate to attendance page
        await page.click("#ctl00_cpStud_lnkStudentMain");
        await page.waitForNavigation({ waitUntil: "networkidle2" });

        // Scrape attendance data
        const attendanceData = await page.evaluate(() => {
            const rows = document.querySelectorAll("#ctl00_cpStud_grdSubject tr");
            const data = [];

            rows.forEach((row, index) => {
                if (index === 0) return; // Skip header row
                const cells = row.querySelectorAll("td");
                if (cells.length === 6) {
                    data.push({
                        subject: cells[1].textContent.trim(),
                        faculty: cells[2].textContent.trim(),
                        classesHeld: cells[3].textContent.trim(),
                        classesAttended: cells[4].textContent.trim(),
                        attendancePercentage: cells[5].textContent.trim(),
                    });
                }
            });
            return data;
        });

        const totalAttendance = await page.evaluate(() => {
            const totalRow = document.querySelector(
                "#ctl00_cpStud_grdSubject tr:last-child td:nth-child(6)"
            );
            return totalRow ? totalRow.textContent.trim() : null;
        });

        // Scrape semester marks data
        await page.click("#ctl00_cpStud_lnkOverallMarksSemwiseMarks");
        await page.waitForNavigation({ waitUntil: "networkidle2" });

        await page.waitForSelector("#ctl00_cpStud_PanelDueSubjects", { visible: true });

        const semMarksData = await page.evaluate(() => {
            const data = {};

            const cgpa = document.querySelector("#ctl00_cpStud_lblMarks")?.textContent.trim();
            if (cgpa) data.cgpa = cgpa;

            const credits = document.querySelector("#ctl00_cpStud_lblCredits")?.textContent.trim();
            if (credits) data.creditsObtained = credits;

            const subjectDue = document.querySelector("#ctl00_cpStud_lblDue")?.textContent.trim();
            if (subjectDue) data.subjectDue = subjectDue;

            return data;
        });

        await browser.close();

        res.status(200).json({ attendanceData, totalAttendance, semesterData: semMarksData });
    } catch (error) {
        console.error("Error fetching data:", error.message);
        res.status(500).json({ error: "Failed to fetch data." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
