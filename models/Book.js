const mongoose = require("mongoose");
const Joi = require("joi");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: "string",
      trim: true,
      required: true,
      minlenght: 3,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      trim: true,
      required: true,
    },
    description: {
      type: "string",
      trim: true,
      required: true,
      minlenght: 3,
      maxlenght: 50,
    },
    price: {
      type: "number",
      required: true,
      min: 0,
    },
    cover: {
      type: "string",
      enum: ["soft cover", "hard cover"],
    },
  },
  {
    timestamps: true,
  }
);

const validateCreateBook = (book) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).required(),
    author: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    price: Joi.number().required(),
    cover: Joi.string().valid("soft cover", "hard cover"),
  });
  return schema.validate(book);
};

const validateupdateBook = (book) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3),
    author: Joi.string().trim(),
    description: Joi.string().trim(),
    price: Joi.number(),
    cover: Joi.string().valid("soft cover", "hard cover"),
  });
  return schema.validate(book);
};

const Book = mongoose.model("Book", bookSchema);
module.exports = {
  Book,
  validateCreateBook,
  validateupdateBook,
};
