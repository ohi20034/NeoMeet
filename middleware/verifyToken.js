const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Replace with your actual secret key

function verifyToken(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' }); // Token missing
    }
    console.log(SECRET_KEY);
    try {
        // Verify the token
        // console.log('hi');
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(SECRET_KEY);
        req.user = decoded; // Attach user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' }); // Token invalid
    }
}

module.exports = verifyToken;
