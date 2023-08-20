const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    // console.log(err.name);
    err.message = err.message || "An Error occured, please try again";
    console.log(
      `[${new Date().toISOString()}] ${req.method} to "${
        req.originalUrl
      }" resulted in error: ${err.message}`
    );

    //CHECK FOR WRONG MONGO OBJECT ID ERROR IN DEVELOPMENT
    if (err.name === "CastError") {
      const msg = `Invalid ID of [${err.value}] passed!`;
      err = new ErrorHandler(msg, 400);
    }
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err,
      errorStack: err.stack,
    });
  } else if (process.env.NODE_ENV === "PRODUCTION") {
    let error = { ...err };
    error.message = err.message;
    console.log(
      `[${new Date().toISOString()}] ${req.method} "${
        req.originalUrl
      }" resulted in error: ${err.message}`
    );
    //CHECK FOR WRONG MONGO OBJECT ID ERROR IN PRODUCTION
    if (error.name === "CastError") {
      const message = `Resource not found for [${error.path}] of [${error.value}]`;
      error = new ErrorHandler(message, 400);
    }
    //MONGO VALIDATION ERRORS IN PRODUCTION
    if (err.name === "ValidationError") {
      const message = error.message;
      error = new ErrorHandler(message, 400);
    }
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} [${JSON.stringify(
        err.keyValue
      )}] entered`;
      error = new ErrorHandler(message, 409);
    }

    //HANDLING INVALID JWT ERRORS
    if (err.name === "JsonWebTokenError") {
      const message = `Invalid JSON Web Token!`;
      error = new ErrorHandler(message, 400);
    }

    //HANDLING EXPIRED JWT ERRORS
    if (err.name === "TokenExpiredError") {
      const message = `JSON Web Token Expired! Please login again!`;
      error = new ErrorHandler(message, 400);
    }
    //DEFAULT RESPONSE
    return res.status(error.statusCode).json({
      success: false,
      message: error.message || "An Error occured, please try again",
    });
  }
};
