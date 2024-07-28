const mongoose = require("mongoose");

const JobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxLength: 30,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxLength: 50,
    },
    status: {
      type: String,
      enum: ["interview", "declined", "pending"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
