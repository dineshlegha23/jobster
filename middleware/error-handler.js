const { StatusCodes } = require("http-status-codes");

const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (err.code && err.code === 11000) {
    (customError.statusCode = 400),
      (customError.msg = `Duplicate value for ${Object.keys(
        err.keyValue
      )} field, please choose another value`);
  }

  if (err.name && err.name === "ValidationError") {
    customError.statusCode = 400;
    customError.msg = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    customError.statusCode = 404;
    customError.msg = `No job found with id : ${err.value}`;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
