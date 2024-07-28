const mongoose = require("mongoose");

const JobSchema = mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxLength: 40,
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
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },
    jobLocation: {
      type: String,
      default: "India",
      require: true,
    },
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", JobSchema);

module.exports = Job;
