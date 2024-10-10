const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const RefreshToken = require('../models/refreshToken.model');

class UserService {
    async registerUser({ username, email, password, role }) {
        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return {
                    status: 409,
                    success: false,
                    message: 'Email already in use.'
                };
            }

            const user = new User({ username, email, password, role });
            await user.save();

            return {
                status: 201,
                success: true,
                data: user,
                message: 'User registered successfully.'
            };
        } catch (error) {
            console.error('Error in registerUser:', error);
            return {
                status: 500,
                success: false,
                message: 'Registration failed.'
            };
        }
    }

    async loginUser({ email, password }) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return {
                    status: 404,
                    success: false,
                    message: 'User not found.'
                };
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return {
                    status: 401,
                    success: false,
                    message: 'Invalid credentials.'
                };
            }

            const tokens = await this.generateTokens(user._id); // Use `this` to call `generateTokens`

            return {
                status: 200,
                success: true,
                data: {
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    user
                },
                message: 'Login successful.'
            };
        } catch (error) {
            console.error('Error in loginUser:', error);
            return {
                status: 500,
                success: false,
                message: 'Login failed.'
            };
        }
    }

    async getUserById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return {
                status: 400,
                success: false,
                message: 'Invalid User ID'
            };
        }

        try {
            const user = await User.findById(id);
            if (!user) {
                return {
                    status: 404,
                    success: false,
                    message: 'User not found'
                };
            }
            return {
                status: 200,
                success: true,
                data: user
            };
        } catch (error) {
            console.error('Error in getUserById:', error);
            return {
                status: 500,
                success: false,
                message: 'Failed to retrieve user'
            };
        }
    }

    async logoutUser(token) {
        try {
            // Handle logout logic, e.g., token blacklisting (if applicable)

            return {
                status: 200,
                success: true,
                message: 'Logout successful.'
            };
        } catch (error) {
            console.error('Error in logoutUser:', error);
            return {
                status: 500,
                success: false,
                message: 'Logout failed.'
            };
        }
    }

    // Function to create access and refresh tokens
    // Function to create access and refresh tokens
async generateTokens(user) {
    try {
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role }, // Ensure role is passed here
            process.env.JWT_SECRET, 
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { userId: user._id, role: user.role }, // Ensure role is passed here
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '7d' }
        );
        await RefreshToken.create({ token: refreshToken });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error('Error generating tokens:', error);
        throw new Error('Failed to generate tokens.');
    }
}

    
    
    
    
    
    
}

module.exports = new UserService();
