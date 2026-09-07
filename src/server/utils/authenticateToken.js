import jwt from "jsonwebtoken";

function authenticateToken(req, res, next) {
    const token = req.cookies?.access_token;

    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Access token required."
        });
    }

    jwt.verify(token, "access_secret", function(err, user) {
        if (err) {
            console.log("JWT error:", err.message);

            return res.status(401).json({
                success: false,
                error: "Access token expired or invalid."
            });
        }

        req.user = user;
        next();
    });
}

export default authenticateToken;