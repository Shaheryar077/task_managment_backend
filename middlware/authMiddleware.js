const jwt = require('jsonwebtoken');





const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ success: false, message: 'No token provided.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid token.' });

        console.log('Decoded Token:', user); // Debugging line
        req.user = { userId: user.userId, role: user.role }; // Ensure user object includes role
        next();
    });
};


module.exports = authenticateToken;



