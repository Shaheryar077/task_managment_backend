const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        console.log('Request User:', req.user); // Debugging line
        console.log('Request User Role:', req.user.role); // Debugging line

        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Forbidden: You do not have permission to perform this action.'
            });
        }
        next();
    };
};

module.exports = authorizeRoles;
