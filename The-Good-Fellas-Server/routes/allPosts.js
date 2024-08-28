const express = require('express');
const router = express.Router();
const { Org } = require('../database/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');




router.get('/', async (req, res) => {
    try {
        const organizations = await Org.find({})
            .select('-password') // Exclude the password field
            .populate({
                path: 'posts',
                populate: {
                    path: 'subs' // Populate subscribers of each post
                }
            });

        res.status(200).json({ data: organizations });
    } catch (error) {
        console.error('Error fetching organizations and subscribers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;