const { model, Schema, default: mongoose } = require("mongoose");
const { createToken } = require("../services/auth");

const Userschema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });

Userschema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) { throw new Error("User not found!"); }

    // ✅ Direct password comparison
    if (user.password !== password) {
        throw new Error("Invalid Password");
    }

    return createToken(user);
});

const User = mongoose.model("User", Userschema);
module.exports = User;
