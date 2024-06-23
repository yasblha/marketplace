const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Enregistrement des utilisateurs
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).send("User created successfully");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating the user");
    }
});

module.exports = router;
