require('dotenv').config(); // Load environment variables
const express = require('express');
const connectDB = require('./Config/Database'); // Adjust path as needed
const userRoutes = require('./routes/userRoutes'); // Adjust path as needed
const taskRoutes = require('./routes/taskRoutes')
// const todoRoutes = require('./routes/todoRoutes');
const cors = require('cors');
const app = express();

// Use the CORS middleware
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));




// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // For parsing application/json

// Use User Routes
// app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/users', taskRoutes);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

// server start

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });


