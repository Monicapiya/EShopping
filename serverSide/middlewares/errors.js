import ErrorHandler from "../checkmate/errorHandler.js";

export default (err, req, res, next) => {
  let error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal server error"
  };

  // Handle invalid ID
  if (err.name === 'CastError') {
    const message = `Item not available. Invalid: ${err?.path}`;
    error = new ErrorHandler(message, 404);
  }

  // Handle validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message);
    error = new ErrorHandler(message, 400);
  }

  // Handle duplicate error
  if (err.code === 11000) {
    const message = `Email has already been registered: ${Object.keys(err.keyValue)}`;
    error = new ErrorHandler(message, 400);
  }

  // Handle invalid/expired JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    const message = `JSON web Token is invalid. Please try again.`;
    error = new ErrorHandler(message, 400);
  }

  if (process.env.NODE_ENV === "DEVELOPMENT") {
    res.status(error.statusCode).json({
      message: error.message,
      error: err,
      stack: err?.stack,
    });
  }

  if (process.env.NODE_ENV === "PRODUCTION") {
    res.status(error.statusCode).json({
      message: error.message,
    });
  }
};
