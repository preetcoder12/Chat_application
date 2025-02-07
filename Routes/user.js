const express = require("express");
const User = require("../models/user");
const router = express.Router();

router.get("/signup", (req, res) => {
    res.render("signup", { error: null });
});

router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.render("signup", { error: "All fields are required!" });
        }
        const user = new User({ username, email, password });
        await user.save();

        res.redirect("/user/signin");
    } catch (err) {
        console.error("Signup Error:", err);
        res.render("signup", { error: "Something went wrong. Please try again!" });
    }
});

router.get("/signin", (req, res) => {
    res.render("signin", { error: null });
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    if (!password || !email) {
        return res.status(400).json({ msg: "Missing information" });
    }
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        res.cookie("token", token, { httpOnly: true });
        return res.render('index');
    } catch (error) {
        console.error("Signin Error:", error);
        return res.render('signin', { error: "Invalid credentials" });
    }
});

module.exports = router;
