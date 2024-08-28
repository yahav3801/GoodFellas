const express = require('express');
const router = express.Router();
const { Org } = require('../database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkVerifyUser = require('../middlewares/verify');

router.get('/', checkVerifyUser, async (req, res) => {
    res.status(200).json({ data: req.currUser });
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await Org.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in the environment variables');
            return res.status(500).json({ error: 'Internal server error' });
        }

        const token = jwt.sign(
            { email: existingUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            userName: existingUser.name,
            email: existingUser.email
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;