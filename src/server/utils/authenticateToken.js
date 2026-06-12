const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.cookies.access_token;

    if(!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    
    jwt.verify(token, "access_secret", function(err, user) {
        if(err)
            return res.status(403).json({ error: "Invalid token."});

        res.user = user;
        next();
    });
}

module.exports = authenticateToken;