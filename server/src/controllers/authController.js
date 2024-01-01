import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import crypto from "crypto";
import { sendEmail } from "../utils/email.js";

const signToken = (payload) => {
  return jwt.sign({ id: payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, statusCode, res) => {
  const token = signToken(user._id);
  // remove password from output
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  // 1) find user based on email
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Missing login information", 400));

  const user = await User.findOne({ email }).select("+password");

  // 2) check if password is correct
  if (!(await user.validatePassword(password, user.password))) {
    return next(new AppError("Password is not correct!", 400));
  }

  // 3) if inactive, activate it (remove field altogether) -- doesn't work for now
  // if (user.active) {
  //   user.active = undefined;
  //   await user.save({ validateBeforeSave: false });
  // }

  // 4) create new token and send it
  createSendToken(user, 200, res);
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get the email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Invalid email address", 401));
  }

  // 2) create passwordResetToken & passwordResetTokenExpires
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}:${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl} \nIf you didn't forget your password, please ignore this email!`;

  // Send email with token
  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token (valid for 10 min)`,
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // await user.save({ validateBeforeSave: false });
    await user.save({ validateModifiedOnly: true }); // similar to one above
    console.log(err);
    return next(
      new AppError(
        "There was an error sending the reset token, Try again later!",
        500
      )
    );
  }
});

// TODO resetPassword function

export const resetPassword = catchAsync(async (req, res, next) => {
  //1) create hash using the token and find the user based on it
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log(hashedToken, req.params.token);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });

  if (!user) {
    return next(
      new AppError("Token has either expired or does not exist anymore.", 401)
    );
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordChangedAt = Date.now();

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  // 1) get token from headers or cookies (cookies will be done in later parts)
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("invalid credentials! Please log in", 401));
  }

  // 2) get user id based on the decoded jwt token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id).select("+password");
  if (!currentUser) {
    return new AppError(
      "The user belonging to this token no longer exists",
      401
    );
  }
  // 3) check if password has changed after token was created
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(
        "The password has changed recently, please log in again.",
        401
      )
    );
  }

  // 4) give access & put user info on req data
  req.user = currentUser;
  next();
});

export const updateMyPassword = catchAsync(async (req, res, next) => {
  // 1) get user from req.user (this runs after protect - it's for signed in users)
  const user = await User.findById(req.user.id).select("+password");

  // 2) check if password is correct and if password confirm is the same as password
  if (!(await user.validatePassword(req.body.passwordCurrent, user.password))) {
    return next(
      new AppError(
        "Password is incorrect, please provide your current correct password",
        400
      )
    );
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(
      new AppError(
        "New passwords do not match, please enter your password confirm again",
        400
      )
    );
  }

  // 3) change passwprds
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
