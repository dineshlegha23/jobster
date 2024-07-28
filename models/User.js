const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Please enter valid email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minLength: [6, "Password must be at least 6 characters long"],
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(this.password, salt);
  this.password = encryptedPassword;
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.createJWT = function (email) {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET
  );
};

const User = mongoose.model("User", UserSchema);
module.exports = User;
