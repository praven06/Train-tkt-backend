const express = require('express')
const cors = require('cors') 
const router = require('./routes/route')
require('dotenv').config()

const app = express()

app.use(express.json())
app.use(cors())
app.use('/', router)

const startServer = async () => {
    try {
        app.listen(3001, () => {
            console.log("Running successfully on port 3001")
        })
    } catch (error) {
        console.error("Error starting the server:", error)
    }
}

startServer()