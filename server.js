
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Serve frontend
app.use(express.static(path.join(__dirname, 'static')));

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com',
        pass: 'YOUR_APP_PASSWORD'
    }
});

// Default Route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'login.html'));
});

// Login Route
app.post('/login', (req, res) => {
    const { email } = req.body;

    const mailOptions = {
        from: 'MindSage <YOUR_EMAIL@gmail.com>',
        to: email,
        subject: 'Welcome to MindSage!',
        text: 'Hello! You have successfully logged into MindSage. Enjoy the game!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('Error sending email');
        }
        res.status(200).send('Email sent and logged in');
    });
});

// Google Auth
passport.use(new GoogleStrategy({
    clientID: "YOUR_GOOGLE_CLIENT_ID",
    clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

app.use(passport.initialize());

// Google Routes
app.get('/auth/google', 
passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
passport.authenticate('google', { failureRedirect: '/' }),
(req, res) => {
res.redirect('/index.html');
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => 
console.log(`Server running on port ${PORT}`)
);