const jwt = require("jsonwebtoken");
const secret = "$preet$";

function createToken(user) {
    const payload = {
        _id: user._id,
        email: user.email,
    };
    return jwt.sign(payload, secret);
}

function validateToken(token) {
    return jwt.verify(token, secret);
}

module.exports = {
    createToken,
    validateToken,
};
