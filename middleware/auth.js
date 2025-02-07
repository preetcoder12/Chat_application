const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Import user model

const checkForAuthentication = (tokenName) => async (req, res, next) => {
    const token = req.cookies[tokenName];

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
    } catch (err) {
        req.user = null;
    }
    next();
};

module.exports = { checkForAuthentication };
