const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const verifyAccessToken = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token missing' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired access token' });
        }

        req.user = decoded; // Add decoded token to request
        next();
    });
};

module.exports = verifyAccessToken;