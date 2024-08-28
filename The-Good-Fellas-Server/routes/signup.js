const express = require('express');
const router = express.Router();
const { Org } = require('../database/models');
const bcrypt = require("bcrypt");

router.post('/', async (req, res) => {
    try {
        const { name, email, password, phoneNumber, address } = req.body;
        
        if (!name) {
            res.json({
                error:'name is required'
            })
        }
        
        if (!password || password.length < 6) {
            res.json({
                error:'password is required and should be at least 6 letters'
            })
        }
        
        const existUser = await Org.findOne({email})
        if (existUser) {
            res.status(404).json({
                error: 'user already exists'
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 8);

        const newUser = await Org.create({
            name, email, password:hashedPassword, phoneNumber, address
        })
        res.json({newUser})
    }
    catch(err){
        console.error(err)
    }
    
});



module.exports = router;
