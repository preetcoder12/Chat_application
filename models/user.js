const { model, Schema } = require("mongoose");

const Userschema = new Schema({
    username: {
        type: String,
        required: true, // Fixed typo
    },
    email: {
        type: String,
        required: true,
    },
    profileImg: {
        type: String, // Added missing type
        default: "/images/userdefault.png" // Ensure correct path
    },
    password: {
        type: String,
        required: true,
    }
});

const User = model("User", Userschema);
module.exports = User;
