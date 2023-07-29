const express = require("express");
const router = express.Router();
const {
  Author,
  validateCreateAuthor,
  validateUpdateAuthor,
} = require("../models/Author");

/**
 * @desc Get all books
 * @route GET /api/authors
 * @access Public
 * @method GET
 */

router.get("/", async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

/**
 * @desc creat new author
 * @route  /api/authors
 * @access Public
 * @method POST
 */

router.post("/", async (req, res) => {
  const { error } = validateCreateAuthor(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  try {
    const author = new Author({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      nationality: req.body.nationality,
      image: req.body.image,
    });
    const result = await author.save();
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

/**
 * @desc update author
 * @route  /api/authors
 * @access Public
 * @method PUT
 */

router.put("/:id", async (req, res) => {
  const { error } = validateUpdateAuthor(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
  }
  try {
    const author = await Author.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          nationality: req.body.nationality,
          image: req.body.image,
        },
      },
      {
        new: true,
      }
    );
    res.status(200).json(author);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

/**
 * @desc  delete book
 * @route  /api/books/:id
 * @access Public
 * @method delete
 */

router.delete("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    if (author) {
      await Author.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "author deleted successfully" });
    } else {
      res.status(404).send({ message: "author not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
