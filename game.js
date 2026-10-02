const express = require('express');
const router = express.Router();
const User = require('./models/User');

router.get('/wallet/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        res.json({ success: true, balance: user.balance, referralCode: user.referralCode, transactions: user.transactions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.post('/play', async (req, res) => {
    try {
        const { username, betType, amount } = req.body;
        const user = await User.findOne({ username: username || 'Fardin22626' });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (user.balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance!' });

        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        const dice3 = Math.floor(Math.random() * 6) + 1;
        const totalSum = dice1 + dice2 + dice3;
        const isTriple = (dice1 === dice2 && dice2 === dice3);

        let isWin = false;
        let multiplier = 1;

        if (betType === 'small' && !isTriple && totalSum >= 4 && totalSum <= 10) { isWin = true; multiplier = 2; }
        else if (betType === 'big' && !isTriple && totalSum >= 11 && totalSum <= 17) { isWin = true; multiplier = 2; }
        else if (betType === 'any_triple' && isTriple) { isWin = true; multiplier = 30; }
        else if (betType === 'specific_triple' && isTriple && dice1 === 1) { isWin = true; multiplier = 100; }
        else if (!isNaN(betType)) {
            const targetTotal = parseInt(betType);
            if (totalSum === targetTotal) {
                isWin = true;
                const odds = { 4: 50, 5: 30, 6: 20, 7: 12, 8: 10, 9: 6, 10: 6, 11: 6, 12: 6, 13: 10, 14: 12, 15: 20, 16: 30, 17: 50 };
                multiplier = odds[targetTotal] || 50;
            }
        }

        let payout = 0;
        if (isWin) {
            payout = amount * multiplier;
            user.balance += (payout - amount);
            user.transactions.push({ type: 'win', amount: payout });
        } else {
            user.balance -= amount;
            user.transactions.push({ type: 'loss', amount: amount });
        }

        await user.save();
        res.json({ success: true, dice: [dice1, dice2, dice3], totalSum, isTriple, isWin, multiplier, payout, newBalance: user.balance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
