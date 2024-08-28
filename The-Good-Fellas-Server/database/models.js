const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Submission Schema
const SubSchema = new Schema(
  {
    subName: { type: String, required: true },
    subEmail: { type: String, required: true },
    subPhone: { type: String, required: true },
    subGroupNum: { type: String, required: true }, // Corrected the type to String
    status: { type: String, default: "Pending" },
  },
  {
    timestamps: true,
  }
);

// Post Schema
const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    aiDesc: { type: String, required: false },
    content: { type: String, required: true },
    type: { type: String, required: true },
    views: { type: Number, default: 0 },
    image: { type: String, required: false },
    locations: [],
    subs: [SubSchema],
  },
  {
    timestamps: true,
  }
);

// Org Schema
const OrgSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    orgImage: { type: String, required: false },
    address: { type: String, required: true },
    posts: [PostSchema],
  },
  {
    timestamps: true,
  }
);

const Org = mongoose.model("Org", OrgSchema);

module.exports = {
  Org,
};