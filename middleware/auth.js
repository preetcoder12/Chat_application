const { validateToken } = require("../services/auth");


function checkForAuthentication(cookie_name) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookie_name];
        if (!tokenCookieValue) {
            console.log("No token found.");
            return next();
        }
        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            console.log("User authenticated:", userPayload);
        } catch (error) {
            console.log("Token validation failed!", error);
        }
        next();
    };
}


module.exports = {
    checkForAuthentication,
}