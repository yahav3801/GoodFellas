const express = require('express');
const router = express.Router();
const { Org } = require('../database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// GET route to fetch org data

router.get('/', async (req, res) => {
    try {
        // Get the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        // Verify and decode the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the org by email (assuming email is stored in the token)
        const org = await Org.findOne({ email: decoded.email })
            .select('-password') // Exclude the password field
            .populate({
                path: 'posts',
                populate: {
                    path: 'subs'
                }
            });

        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        res.status(200).json({ data: org });
    } catch (error) {
        console.error('Error fetching org data:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});




// POST route for org login
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


router.put('/', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { name, email, phoneNumber, address } = req.body;

        const org = await Org.findOneAndUpdate(
            { email: decoded.email },
            { name, email, phoneNumber, address },
            { new: true, runValidators: true }
        ).select('-password');

        if (!org) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        res.status(200).json({ data: org });
    } catch (error) {
        console.error('Error updating org data:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
