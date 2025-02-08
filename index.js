require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");
const userRoutes = require("./Routes/user"); // Fixed import
const cookieparser = require("cookie-parser");
const { checkForAuthentication } = require("./middleware/auth")
const { Server } = require("socket.io");
const multer = require("multer")

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
app.use("/images", express.static(path.join(__dirname, "public/images")));


app.use(checkForAuthentication("token"));

// ✅ Create HTTP Server
const server = http.createServer(app);
const io = new Server(server);

// ✅ Socket.io Handling
io.on("connection", (socket) => {
    socket.on("user_message", (message) => {
        socket.broadcast.emit("message", message); // Broadcast to others, not back to sender
    });

    socket.on("image", ({ text, imageUrl }) => {
        socket.broadcast.emit("image_msg", { text, imageUrl }); // Broadcast image message
    });

});


// ✅ Routes
app.get("/", (req, res) => {
    return res.render("index", {
        user: req.user || null, // Ensure user is passed even if it's null
    });
});

const storage = multer.diskStorage({
    destination: path.join(__dirname, "public/images"), // Use correct path
    filename: (req, file, cb) => { // Fix 'file' reference
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file selected" });
    }
    const imageurl = "/images/" + req.file.filename;
    res.json({ imageurl }); // Send response correctly
});




// Use User Routes
app.use("/user", userRoutes);

// ✅ Start Server
server.listen(port, () => {
    console.log(`🚀 Server live at port ${port}`);
});
