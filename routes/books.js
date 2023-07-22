const express = require("express");
const Joi = require("joi");
const router = express.Router();

const books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    description:
      "A powerful story of racial injustice and moral growth set in the American South.",
    price: 15.99,
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    description:
      "A dystopian novel portraying a totalitarian society ruled by a figure known as Big Brother.",
    price: 12.49,
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    description:
      "A tale of wealth, love, and decadence in the Roaring Twenties.",
    price: 9.99,
  },
];

router.get("/", (req, res) => {
  res.status(200).json(books);
});
/////////////////////////////////////
router.get("/:id", (req, res) => {
  const book = books.find((book) => book.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json(book);
  } else {
    res.status(404).send("book not found");
  }
});
////////////////////////////////////
router.post("/", (req, res) => {
  const { error } = validateCreateBook(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  const book = {
    id: books.length + 1,
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    price: req.body.price,
  };
  books.push(book);
  res.status(201).json(book); // 201 Created
});

router.put("/:id", (req, res) => {
  const book = books.find((book) => book.id === parseInt(req.params.id));
  const { error } = validateupdateBook(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  if (book) {
    res.status(200).json({ message: "book updated successfully" });
  } else {
    res.status(404).send({ message: "book not found" });
  }
});

const validateCreateBook = (book) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3).required(),
    author: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    price: Joi.number().required(),
  });
  return schema.validate(book);
};

const validateupdateBook = (book) => {
  const schema = Joi.object({
    title: Joi.string().trim().min(3),
    author: Joi.string().trim(),
    description: Joi.string().trim(),
    price: Joi.number(),
  });
  return schema.validate(book);
};

router.delete("/:id", (req, res) => {
  const book = books.find((book) => book.id === parseInt(req.params.id));
  if (book) {
    res.status(200).json({ message: "book deleted successfully" });
  } else {
    res.status(404).send({ message: "book not found" });
  }
});

module.exports = router;
