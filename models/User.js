const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
      minlenght: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);
const validateCreateUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().min(6).required(),
    userName: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
};

const validateLoginUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().required().email(),
    password: Joi.string().trim().min(6).required(),
  });
  return schema.validate(obj);
};

const validateUpdateUser = (obj) => {
  const schema = Joi.object({
    email: Joi.string().trim().email(),
    userName: Joi.string().trim().min(6).max(50),
    password: Joi.string().trim().min(6),
  });
  return schema.validate(obj);
};

module.exports = {
  User,
  validateCreateUser,
  validateLoginUser,
  validateUpdateUser,
};
