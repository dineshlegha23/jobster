const { BadRequestError } = require("../errors");

const checkDemoUser = (req, res, next) => {
  if (req.testUser) {
    throw new BadRequestError("Demo User");
  }
  next();
};

module.exports = checkDemoUser;
