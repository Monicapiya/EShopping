import catchErrors from "../checkmate/catchErrors.js";
import User from "../models/users.js";
import ErrorHandler from "../checkmate/errorHandler.js";
import assignToken from "../utility/assginToken.js";
import sendEmail from "../utility/sendEmail.js";
import { getResetPasswordTemplate } from "../utility/emailTemplates.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utility/cloudnary.js";

// register user

export const registerUser = catchErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  assignToken(user, 201, res);
});

// user login

export const userLogin = catchErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email & password", 400));
  }

  // find user 

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // check if the PW is correct

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  assignToken(user, 200, res);
});

//User logout

export const logout = catchErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "Logged out",
  });
});



// forgot password

export const forgotPassword = catchErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save();

  // create reset password url

  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = getResetPasswordTemplate(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "EShopping Password recovery",
      message,
    });

    res.status(200).json({
      message: `Email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error?.message, 500));
  }
});

// reset password

export const resetPassword = catchErrors(async (req, res, next) => {
  // url token

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Password reset token has been expired or invalid", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password doesn't match", 400));
  }

  // set new password

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  assignToken(user, 200, res);
});

// get user profile

export const getUserProfile = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    user,
  });
});

// update password

export const updatePassword = catchErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  // password match

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  user.password = req.body.password;
  user.save();

  res.status(200).json({
    success: true,
  });

});



// update user profile

export const updateProfile = catchErrors(async (req, res, next) => {
  
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
    
  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });

});


// get all users

export const allUsers = catchErrors(async (req, res, next) => {
  
 const users = await User.find();

 res.status(200).json({
  users,
 });

});


// get user details

export const getUserDetails = catchErrors(async (req, res, next) => {
  
  const user = await User.findById(req.params.id);

  if(!user){
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }
 
  res.status(200).json({
   user,
  });
 
 });



 // update  user details

export const updateUser = catchErrors(async (req, res, next) => {
  
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
    
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });
 
  res.status(200).json({
   user,
  });
 
 });
 
 

// delete user details

export const deleteUser = catchErrors(async (req, res, next) => {
  
  const user = await User.findById(req.params.id);

  if(!user){
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }


  await user.deleteOne();
 
  res.status(200).json({
   success: true,
  });
 
 });

