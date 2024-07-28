const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (isMatch) {
    res.status(200).json({
      user: {
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        location: user.location,
        token: user.createJWT(user.email),
      },
    });
  } else {
    throw new BadRequestError("Invalid Password");
  }
};

const logout = async (req, res) => {
  res.status(200).json({ msg: "logged out", user: null, token: "" });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("Please provide name, email and password values");
  }

  const user = await User.create({ name, email, password });
  res.status(201).json({
    msg: "success",
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      token: user.createJWT(user.email),
    },
  });
};

const updateUser = async (req, res) => {
  const {
    user: { userId },
    body: { email, name, lastName, location },
  } = req;

  if (!name || !email || !lastName || !location) {
    throw new BadRequestError("Pleasae provide all values");
  }

  const user = await User.findOne({ _id: userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();

  res.status(200).json({
    user: {
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      location: user.location,
      token: user.createJWT(user.email),
    },
  });
};

module.exports = { login, logout, register, updateUser };
