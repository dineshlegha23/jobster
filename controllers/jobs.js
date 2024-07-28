const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const {
    user: { userId },
  } = req;

  const jobs = await Job.find({ createdBy: userId }).select("company position");

  res.json({ msg: "success", total: jobs.length, jobs });
};

const createJob = async (req, res) => {
  const {
    user,
    body: { company, position },
  } = req;

  if (!company || !position) {
    throw new BadRequestError("Kindly provide company and position");
  }

  const job = await Job.create({ company, position, createdBy: user.userId });

  res.status(201).json({ msg: "success", job });
};

const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
    body: { company, position },
  } = req;

  if (!company || !position) {
    throw new BadRequestError("Kindly provide company and position");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position },
    { new: true }
  );
  if (!job) {
    throw new NotFoundError("Job not found");
  }
  res.json({ msg: "success", job });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { userId } = req.user;

  let job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError("No job found");
  }

  res.status(204).json();
};

const getSingleJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  res.status(200).json({ msg: "success", job });
};

module.exports = { getAllJobs, getSingleJob, deleteJob, updateJob, createJob };
