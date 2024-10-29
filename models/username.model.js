const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
  ticketNumber: { type: String, required: true, unique: true },
  train: { type: String, required: true },
  classType: { type: String, required: true },
 
});

const usernameSchema = mongoose.Schema({
    name:{
        type:String,
        required: [true,"please enter your name"]
    },
    username:{
        type:String,
        required: [true,"please enter your username"]
    },
    email: {
        type: String,
        required: [true,"please enter your email"],
        unique: true,
        validate: {
            validator: function(value) {
                return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            },
            message: 'Please enter a valid email address'
        }
    },
    password:{
        type:String,
        required: [true,"please enter your password"]
    },
    Tickets: {
        type: [ticketSchema],
        default:[]
    }
})


const Username= mongoose.model("Username",usernameSchema)

module.exports = Username