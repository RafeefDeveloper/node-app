const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  User,
  validateLoginUser,
  validateCreateUser,
} = require("../models/User");

/**
 *  @desc    Register New User
 *  @route   /api/auth/register
 *  @method  POST
 *  @access  public
 */
router.post("/register", async (req, res) => {
  const { error } = validateCreateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    let user = await User.findOne({ email: req.body.email }); // check if user already exists
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt); //incodung password
    user = new User({
      email: req.body.email,
      password: req.body.password,
      userName: req.body.userName,
      // isAdmin: req.body.isAdmin,
    });
    const result = await user.save();
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      "secretKey"
    );
    const { password, ...others } = result._doc; // hide password from user
    res.status(201).json({ ...others, token });
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

/**
 *  @desc    Login User
 *  @route   /api/auth/login
 *  @method  POST
 *  @access  public
 */

router.post("/login", async (req, res) => {
  const { error } = validateLoginUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "email or password inavalid" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    ); // check if password is correct
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "email or password inavalid" });
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      "secretKey"
    );
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
