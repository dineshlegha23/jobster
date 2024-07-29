const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const {
    user: { userId },
    query: { sort, status, search, jobType },
  } = req;

  const userFilters = {
    createdBy: userId,
  };

  if (search) {
    userFilters.position = { $regex: search, $options: "i" };
  }

  if (status && status != "all") {
    userFilters.status = status;
  }

  if (jobType && jobType != "all") {
    userFilters.jobType = jobType;
  }

  let result = Job.find(userFilters);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = Math.ceil(page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(userFilters);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.json({ msg: "success", totalJobs, jobs, numOfPages });
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
    body: { company, position, jobLocation, jobType, status },
  } = req;

  if (!company || !position || !jobLocation || !jobType || !status) {
    throw new BadRequestError("Kindly provide company and position");
  }

  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position, jobLocation, jobType, status },
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
