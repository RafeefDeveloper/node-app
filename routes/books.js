const express = require("express");
const router = express.Router();
const {
  Book,
  validateCreateBook,
  validateUpdateBook,
} = require("../models/Book");

router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("author");
    res.status(200).json(books);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
/////////////////////////////////////
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).send("book not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});
////////////////////////////////////
router.post("/", async (req, res) => {
  const { error } = validateCreateBook(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    });
    const result = await book.save();
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateupdateBook(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          author: req.body.author,
          description: req.body.description,
          price: req.body.price,
          cover: req.body.cover,
        },
      },
      { new: true }
    );
    res.status(200).json(book);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.delete("/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  try {
    if (book) {
      await Book.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "book deleted successfully" });
    } else {
      res.status(404).send({ message: "book not found" });
    }
  } catch (error) {}
});

module.exports = router;
