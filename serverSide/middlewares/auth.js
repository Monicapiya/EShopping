import catchErrors from "../checkmate/catchErrors.js";
import ErrorHandler from "../checkmate/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

// Check if the user is authenticated
export const isAuthenticatedUser = catchErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler("Please login into your Account", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);

  next();
});

// Authorize roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role (${req.user.role}) is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
