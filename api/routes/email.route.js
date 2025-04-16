// const express = require('express');
// const nodemailer = require('nodemailer');
// const router = express.Router();
// const dotenv = require('dotenv');

// import express from 'express';
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// const router = express.Router();


// dotenv.config();

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });
// console.log('Email User:', process.env.EMAIL_USER);
// console.log('Email Pass:', process.env.EMAIL_PASS);

// router.post('/', async (req, res) => {
//     const { to, subject, html } = req.body;
//     console.log('Sending email to:', to);
//     console.log('Subject:', subject);
//     console.log('HTML:', html);
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         html,
//     };
//     try {
//         await transporter.sendMail(mailOptions);
//         res.json({ message: 'Email sent successfully' });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// //module.exports = router;
// export default router;

//-----------------------------------------------------------------

import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

import Listing from '../models/listing.model.js';

dotenv.config();

const router = express.Router();

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

console.log('Email User:', process.env.EMAIL_USER);
console.log('Email Pass:', process.env.EMAIL_PASS);


// // Endpoint to send an email
// router.post('/email', async (req, res) => {
//     const { to, subject, html } = req.body;
//     console.log('Sending email to:', to);
//     console.log('Subject:', subject);
//     console.log('HTML:', html);
    
//     const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         html,
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.json({ message: 'Email sent successfully' });
//     } catch (error) {
//         console.error('Error sending email:', error);
//         res.status(500).json({ error: error.message });
//     }
// });

// Endpoint to send multiple emails
router.post('/email', async (req, res) => {
    const emails = req.body; // Expecting an array of email objects

    try {
        const emailPromises = emails.map(async (email) => {
            const { to, subject, html } = email;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to,
                subject,
                html,
            };
            await transporter.sendMail(mailOptions);
        });

        await Promise.all(emailPromises); // Wait for all emails to be sent
        res.json({ message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error sending emails:', error);
        res.status(500).json({ error: error.message });
    }
});


// Endpoint to handle asset acceptance and rejection
router.post('/asset-response', (req, res) => {
    const { assetId, decision } = req.body; // Expecting decision to be either 'accept' or 'reject'

    if (decision === 'accept') {
        // Logic to handle asset acceptance
        return res.json({ message: `Asset ${assetId} accepted` });
    } else if (decision === 'reject') {
        // Logic to handle asset rejection
        return res.json({ message: `Asset ${assetId} rejected` });
    } else {
        return res.status(400).json({ message: 'Invalid decision' });
    }
});

// Endpoint to handle Accept action
router.get('/accept/:id', async (req, res) => {
  try {
    const listingId = req.params.id;
    // Handle the accept action (e.g., update the listing status)
    await Listing.findByIdAndUpdate(listingId, { status: 'Accepted' });
    res.send('Listing accepted successfully');
  } catch (error) {
    console.error('Error accepting listing:', error);
    res.status(500).send('Error accepting listing');
  }
});

// Endpoint to handle Reject action
router.get('/reject/:id', async (req, res) => {
  try {
    const listingId = req.params.id;
    // Handle the reject action (e.g., update the listing status)
    await Listing.findByIdAndUpdate(listingId, { status: 'Rejected' });
    res.send('Listing rejected successfully');
  } catch (error) {
    console.error('Error rejecting listing:', error);
    res.status(500).send('Error rejecting listing');
  }
});


// Export the router
export default router;