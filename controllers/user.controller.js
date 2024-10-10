const UserService = require('../utils/userService'); // Adjust path as needed
const RefreshToken = require('../models/refreshToken.model');
const jwt = require('jsonwebtoken');



const registerUser = async (req, res) => {
    try {
        // Extracting role from request body if provided, otherwise it defaults to 'user'
        const { username, email, password, role = 'user' } = req.body;

        const user = await UserService.registerUser({
            username,
            email,
            password,
            role // Pass the role to the service
        });

        // If registration fails
        if (!user.success) {
            return res.status(user.status).json({
                success: false,
                message: user.message
            });
        }

        // Successful registration response
        res.status(201).json({
            success: true,
            data: user.data,
            message: user.message
        });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({
            success: false,
            message: 'Registration failed.',
            error: err.message
        });
    }
};



const loginUser = async (req, res) => {
    try {
        const user = await UserService.loginUser({
            email: req.body.email,
            password: req.body.password
        });
        if (!user.success) {
            return res.status(user.status).json({
                success: false,
                message: user.message
            });
        }

        // Generate access and refresh tokens
        const accessToken = jwt.sign(
            { userId: user.data.user._id, role: user.data.user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );
        
        const refreshToken = jwt.sign(
            { userId: user.data.user._id, role: user.data.user.role },
            process.env.REFRESH_TOKEN_SECRET
        );

        // Store refresh token in DB
        await RefreshToken.create({ token: refreshToken, userId: user.data.user._id });

        res.status(200).json({
            success: true,
            accessToken,
            refreshToken, // Include refresh token in the response
            user: user.data.user
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({
            success: false,
            message: 'Login failed.',
            error: err.message
        });
    }
};






const getUserById = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserService.getUserById(userId);
        res.status(200).json({
            success: true,
            data: user.data
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'user not found.'
        });
    }
};


const logoutUser = async(req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(400).json({
                success: false,
                message: 'Token required for logout.'
            });
        }

        // Extract token from Authorization header
        const token = authHeader.split(' ')[1];

        // Call UserService to handle logout
        const result = await UserService.logoutUser(token);

        res.status(result.status).json({
            success: result.success,
            message: result.message
        });
    } catch (err) {
        console.error('Error during logout:', err.message);
        res.status(500).json({
            success: false,
            message: 'Logout failed.',
            error: err.message
        });
    }
    
    
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log('Decoded refresh token:', decoded); // Debugging line

        // Check if the token is in the database
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (!storedToken) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token' });
        }

        // Generate a new access token
        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.status(200).json({ success: true, accessToken });
    } catch (error) {
        console.error('Error in refreshToken:', error); // Debugging line
        res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getUserById,
    logoutUser,
    refreshToken,
};