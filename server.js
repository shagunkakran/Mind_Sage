
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com', // Aapka email
        pass: 'YOUR_APP_PASSWORD'    // Google App Password
    }
});

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to MindSage!' });
});

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

app.listen(3000, () => console.log('Server running on port 3000'));

// Server.js mein ye extra lagega
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: "YOUR_GOOGLE_CLIENT_ID",
    clientSecret: "YOUR_GOOGLE_CLIENT_SECRET",
    callbackURL: "/auth/google/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    // Yahan aap user ka data save kar sakti hain
    return done(null, profile);
  }
));

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => { res.redirect('/index.html'); } // Success par game page
);
