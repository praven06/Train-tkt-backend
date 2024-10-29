
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to the database")
    } catch (error) {
        console.error("Failed to connect to the database:", error)
        throw error 
    }
}

const closeDB = async () => {
    try {
        await mongoose.connection.close()
        console.log("Database connection closed")
    } catch (error) {
        console.error("Error closing the database connection:", error)
        throw error
    }
}

module.exports = { connectDB, closeDB }
