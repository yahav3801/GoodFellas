const express = require('express');
const router = express.Router();
const { Org } = require('../database/models');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
};

// POST route to update status and send email if approved
router.post('/update-status', async (req, res) => {
  try {
    const { postId, subId, newStatus } = req.body;
    const org = await Org.findById(req.userId);
    if (!org) return res.status(404).json({ message: 'Organization not found' });

    const post = org.posts.id(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const sub = post.subs.id(subId);
    if (!sub) return res.status(404).json({ message: 'Subscriber not found' });

    // Update subscriber status in the database
    sub.status = newStatus;

    // If the new status is "Approved", send an email
    if (newStatus === "Approved") {
      // Create a nodemailer transporter
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Prepare email content
      let mailOptions = {
        from: `"${org.name}" <${process.env.EMAIL_USER}>`,
        to: sub.subEmail,
        subject: `Application Approved for ${post.title}`,
        text: `Dear ${sub.subName},\n\nCongratulations! Your application for "${post.title}" has been approved.\n\nBest regards,\n${org.name}`,
        html: `<p>Dear ${sub.subName},</p><p>Congratulations! Your application for "${post.title}" has been approved.</p><p>Best regards,<br>${org.name}</p>`
      };

      // Send email
      await transporter.sendMail(mailOptions);
    }

    await org.save();

    res.status(200).json({ message: 'Status updated successfully', newStatus });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

module.exports = router;