const express = require("express");
const router = express.Router();
const { Org } = require("../database/models");
const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  try {
    const { orgId, title, content, type, aiDesc, locations, image } = req.body;
    const _id = orgId;
    const org = await Org.findOne({ _id });
    if (!org) {
      res.status(401).json({
        error: "organization not found",
      });
    }
    const newPost = {
      orgId,
      title,
      content,
      type,
      aiDesc,
      locations,
      subs: [],
      image,
    };
    org.posts.push(newPost);
    org.save();
    res.status(201).json({ msg: "Post created succesfully" });
  } catch (err) {
    console.error(err);
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const org = await Org.findOne({ "posts._id": postId });

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

router.delete("/", async (req, res) => {
  try {
    const { orgId, postId } = req.body;
    const org = await Org.findById(orgId);

    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }

    // Use pull() method to remove the subdocument
    org.posts.pull({ _id: postId });
    await org.save();

    res.status(200).json({ msg: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/", async (req, res) => {
  try {
    const { orgId, postId, title, content, type, aiDesc, locations } = req.body;
    const _id = orgId;
    const org = await Org.findOne({ _id });
    if (!org) {
      res.status(401).json({
        error: "organization not found",
      });
    }
    const post = org.posts.id(postId);
    post.title = title;
    post.content = content;
    post.type = type;
    post.aiDesc = aiDesc;
    post.locations = locations;
    org.save();
    res.status(200).json({ msg: "Post updated succesfully" });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
