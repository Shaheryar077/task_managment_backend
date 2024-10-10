const mongoose = require("mongoose")


const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
    } catch (error) {
        console.error("error to connect mongodb",error.message);
        
    }

}

module.exports = connectDB