const { Org } = require("../database/models");
const jwt = require("jsonwebtoken");

const checkVerifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await Org.findOne({ email: decoded.email });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      req.currUser = user;
      next();
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = checkVerifyUser;
