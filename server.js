const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

const users = {}; //Mock Database

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

app.post('/send-magic-link', (req, res) => {
    const { email } = req.body;
    console.log('Received request to send magic link for email:', email);
    
    if (!email) {
        console.error('Email is required');
        return res.status(400).json({ message: 'Email is required' });
    }

    const authCode = crypto.randomBytes(16).toString('hex');

    const magicLink = `http://localhost:3000/verify?email=${encodeURIComponent(email)}&code=${authCode}`;

    users[email] = { authCode, sessionKey: null };

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Magic Link',
        text: `Click the following link to log in: ${magicLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Failed to send email:', error);
            return res.status(500).json({ message: 'Failed to send email' });
        }
        console.log('Magic link sent:', info.response);
        res.status(200).json({ message: 'Magic link sent' });
    });
});

app.get('/verify', (req, res) => {
    const { email, code } = req.query;
    const user = users[email];

    if (user && user.authCode === code) {
        const sessionKey = crypto.randomBytes(16).toString('hex');
        user.sessionKey = sessionKey;

        // Simulate redirection with session key
        res.send(`Login successful! Your session key: ${sessionKey}`);
    } else {
        res.status(400).send('Invalid or expired magic link');
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});