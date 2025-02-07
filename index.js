require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");
const userRoutes = require("./Routes/user"); // Fixed import
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
app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html")); // Fixed path
});

// Use User Routes
app.use("/user", userRoutes);

// ✅ Start Server
server.listen(port, () => {
    console.log(`🚀 Server live at port ${port}`);
});
