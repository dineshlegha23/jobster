const express = require("express");
const router = express.Router();
const authentication = require("../middleware/authentication");
const { login, logout, register, updateUser } = require("../controllers/auth");

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.patch("/updateUser", authentication, updateUser);

module.exports = router;
