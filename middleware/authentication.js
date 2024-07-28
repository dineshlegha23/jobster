const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    throw new UnauthenticatedError("Kindly log in first");
  }
  if (authorization.startsWith("Bearer ")) {
    token = authorization.split(" ")[1];
    try {
      const user = await jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
    } catch (err) {
      throw new UnauthenticatedError("Invalid token, kindly login");
    }
  }

  next();
};

module.exports = authMiddleware;
