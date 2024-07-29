const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const { login, logout, register, updateUser } = require("../controllers/auth");
const checkDemoUser = require("../middleware/demoUser");
const rateLimiter = require("express-rate-limit");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: "Too many requests, please try again after 15 minutes",
  },
});

router.post("/login", apiLimiter, login);
router.post("/logout", logout);
router.post("/register", apiLimiter, register);
router.patch("/updateUser", authentication, checkDemoUser, updateUser);

module.exports = router;
