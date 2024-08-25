const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();


// REGISTER NEW USER
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
        if(err) {
            return res.status(500).json({error: err.message});
        }
        res.status(201).json({ message: 'User Registered SUCCESSFULLY !'})
        console.log("new user created")
    });
});

// LOGIN USER
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if(err || results.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials'});
        }

        const user = results[0]
        console.log(user)
        const passwordMatch = bcrypt.compareSync(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({error: 'Invalid Credentials'});
        }
        console.log("user logged in")

        const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '5m' });
        res.json({ token });
    });
});

module.exports = router;