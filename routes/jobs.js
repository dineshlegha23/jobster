const express = require("express");
const router = express.Router();
const checkDemoUser = require("../middleware/demoUser");
const {
  getAllJobs,
  createJob,
  getSingleJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(checkDemoUser, createJob);
router
  .route("/:id")
  .get(getSingleJob)
  .patch(checkDemoUser, updateJob)
  .delete(checkDemoUser, deleteJob);

module.exports = router;
