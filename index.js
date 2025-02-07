require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");
const userRoutes = require("./Routes/user"); // Fixed import
const cookieparser = require("cookie-parser");
const {checkForAuthentication} = require("./middleware/auth")
const { Server } = require("socket.io");

const app = express();
const port = process.env.PORT || 8000;

// ✅ MongoDB Connection with Error Handling
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1); // Exit the process if MongoDB fails to connect
    }
})();

// ✅ Middleware Setup
app.use(express.static(path.resolve(__dirname, "public")));
app.use(express.urlencoded({ extended: false })); // Fixed typo
app.use(express.json());
app.use(cookieparser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(checkForAuthentication("token"));

// ✅ Create HTTP Server
const server = http.createServer(app);
const io = new Server(server);

// ✅ Socket.io Handling
io.on("connection", (socket) => {
    console.log("🟢 A user connected");

    socket.on("user_message", (message) => {
        io.emit("message", message);
    });
});

// ✅ Routes
app.get('/', async (req, res) => {
    console.log("User data at home:", req.user);
    return res.render("home", {
        user: req.user || null,
    });
});


// Use User Routes
app.use("/user", userRoutes);

// ✅ Start Server
server.listen(port, () => {
    console.log(`🚀 Server live at port ${port}`);
});
