const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/register', async (req, res) => {
    res.json({ success: true, message: 'Registration successful' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === 'Fardin22626' && password === 'Fardin@2003') {
        return res.json({ 
            success: true, 
            message: 'Login successful', 
            user: { 
                username: 'Fardin22626', 
                balance: 5000, 
                referralCode: 'FARDIN2026', 
                isAdmin: true 
            } 
        });
    }
    res.status(400).json({ success: false, message: 'Invalid username or password' });
});

router.post('/deposit', async (req, res) => {
    const { amount } = req.body;
    res.json({ success: true, newBalance: 5000 + Number(amount), message: 'Deposit successful!' });
});

router.post('/withdraw', async (req, res) => {
    const { amount } = req.body;
    res.json({ success: true, newBalance: 5000 - Number(amount), message: 'Withdrawal request submitted!' });
});

module.exports = router;
