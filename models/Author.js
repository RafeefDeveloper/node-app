const mongoose = require("mongoose");
const Joi = require("joi");

const authorSchema = new mongoose.Schema(
  {
    firstName: {
      type: "string",
      trim: true,
      required: true,
      minlenght: 3,
    },
    lastName: {
      type: "string",
      trim: true,
      required: true,
      minlenght: 3,
    },
    nationality: {
      type: "string",
      trim: true,
      required: true,
      minlenght: 3,
    },
    image: {
      type: "string",
      default: "default-avtar.png",
    },
  },
  { timestamps: true }
);

const validateCreateAuthor = (author) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3).required(),
    lastName: Joi.string().trim().required(),
    nationality: Joi.string().trim(),
    image: Joi.string().trim(),
  });
  return schema.validate(author);
};

const validateUpdateAuthor = (author) => {
  const schema = Joi.object({
    firstName: Joi.string().trim().min(3),
    lastName: Joi.string().trim(),
    nationality: Joi.string().trim(),
    image: Joi.string().trim(),
  });
  return schema.validate(author);
};

const Author = mongoose.model("Author", authorSchema);

module.exports = {
  Author,
  validateCreateAuthor,
  validateUpdateAuthor,
};
