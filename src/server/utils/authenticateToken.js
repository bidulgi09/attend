const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.cookies.access_token;

    if(!token) {
        req.user = null; 
        return next();
    }
    try {
    jwt.verify(token, "access_secret", function(err, user) {
        if(err)
            return res.status(403).json({ error: "Invalid token."});

        req.user = user;
        next();
    });
    } catch(e) {
        console.log(e);
        return next();
    }
}

module.exports = authenticateToken;