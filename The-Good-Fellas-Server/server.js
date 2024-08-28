const express = require("express");
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const loginRoute = require("./routes/login");
const signupRoute = require("./routes/signup");
const postRoute = require("./routes/post");
const orgRoute = require("./routes/org");
const subRoute = require("./routes/sub");
const aiRoure = require("./routes/ai");
const allPostsRoute = require("./routes/allPosts");
const checkVerifyUser = require("./middlewares/verify");

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

connectDB();

app.use("/api/login", loginRoute);
app.use("/api/signup", signupRoute);
app.use("/api/post", postRoute);
app.use("/api/org", orgRoute);
app.use("/api/ai", aiRoure);
app.use("/api/allPosts", allPostsRoute);
app.use("/api/sub", subRoute);

const port = 8000;
app.listen(port, () => console.log(`listening on port ${port}`));
