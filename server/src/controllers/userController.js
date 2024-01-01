import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import * as handlerFactory from "./handlerFactory.js";

export const getUser = handlerFactory.getOne(User);
export const getAllUsers = handlerFactory.getAll(User);

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!docs) {
    return next(new AppError("No document was found with given ID", 404));
  }

  user.active = false;
  user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
