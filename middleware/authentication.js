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
      if (user.userId === "66a5fd6ba81714d36858112f") {
        req.user = user;
        req.testUser = true;
      } else {
        req.user = user;
      }
    } catch (err) {
      throw new UnauthenticatedError("Invalid token, kindly login");
    }
  }

  next();
};

module.exports = authMiddleware;
