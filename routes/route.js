const express = require('express')
const router = express.Router()
const {
    signup,
    login,
    GetAllTickets,
    AddTicket,
    removeTicket
} = require('../controllers/controller')

router.get('/tickets', GetAllTickets)
router.put('/addticket', AddTicket)
router.post('/login',login)
router.post('/signup',signup)
router.delete('/ticket/delete',removeTicket)
module.exports = router;