const express = require("express");
const path = require("path");
const User = require("../models/user");
const route = express.Router();

route.get("/signup", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../public/signup.html"));
});

route.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // ✅ Validate input fields
        if (!username || !password || !email) {
            return res.status(400).json({ msg: "Missing information" }); // Changed status code to 400
        }

        // ✅ Create user in the database
        await User.create({
            username,
            email,
            password,
        });

        // ✅ Redirect user to home page or login page
        return res.redirect("/");
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Server error. Please try again." });
    }
});

module.exports = route;
