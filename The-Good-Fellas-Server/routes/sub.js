const express = require("express");
const router = express.Router();
const { Org } = require("../database/models");
const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/", async (req, res) => {
  console.log(process.env.EMAIL_HOST);
  try {
    const { postId, subName, subEmail, subPhone, subGroupNum } = req.body;

    // Find the organization document that contains the post
    const org = await Org.findOne({ "posts._id": postId });

    if (!org) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the specific post by its ID
    const post = org.posts.id(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Add the new subscription to the post's subs array
    post.subs.push({
      subName,
      subEmail,
      subPhone,
      subGroupNum,
    });

    // Save the updated organization document
    await org.save();

    // Send a thank you email
    const mailOptions = {
      from: `"GoodFellas" <${process.env.EMAIL_USER}>`,
      to: subEmail,
      subject: "Thank You for Your Submission",
      text: `Dear ${subName},\n\nThank you for submitting to our event "${post.title}". We appreciate your interest and will be in touch soon.\n\nBest regards,\nGoodFellas Team`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email: ", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.json({ message: "Submission successful and email sent", post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { postId, subName, subEmail, subPhone, subGroupNum } = req.body;

    // Find the organization document that contains the post
    const org = await Org.findOne({ "posts._id": postId });

    if (!org) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Find the specific post by its ID
    const post = org.posts.id(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Add the new subscription to the post's subs array
    post.subs.push({
      subName,
      subEmail,
      subPhone,
      subGroupNum,
    });

    // Save the updated organization document
    await org.save();

    res.json({ post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const org = await Org.findOne({ "posts._id ": postId });

    if (!org) {
      return res.status(404).json({ error: "Post not found" });
    }
    const post = org.posts.id(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
