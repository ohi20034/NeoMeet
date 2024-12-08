const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET_KEY; 
function verifyToken(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' }); 
    }
    console.log(SECRET_KEY);
    try {
        // console.log('hi');
        const decoded = jwt.verify(token, SECRET_KEY);
        console.log(SECRET_KEY);
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token' }); 
    }
}

module.exports = verifyToken;
