import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name."],
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email."],
    unique: true,
    validator: [validator.isEmail, "Invalid email address!"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "A user must have a password."],
    minlength: [8, "Password must be at least 8 characters long"],
    maxlength: [50, "Password must be at most 50 characters long"],
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password."],
    validate: {
      validator: function (el) {
        return this.password === el;
      },
      message: "Passwords do not match!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  PasswordResetExpires: Date,
  active: {
    type: Boolean,
    select: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
