const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { validateUpdateUser, User } = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("../middleware/verifyToken");

/**
 *  @desc    Update User
 *  @route   /api/users/:id
 *  @method  PUT
 *  @access  private (only admin & user himself)
 */

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  // if (req.user.id !== req.params.id) {
  //   return res.status(403).json({ message: "Not allwed" });
  // }
  try {
    const { error } = validateUpdateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const userUpdate = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          email: req.body.email,
          userName: req.body.userName,
          password: req.body.password,
        },
      },
      { new: true }
    ).select("-password");
    res.status(200).json(userUpdate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

/**
 *  @desc    Get All Users
 *  @route   /api/users
 *  @method  GET
 *  @access  private (only admin)
 */
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

/**
 *  @desc    Get User By Id
 *  @route   /api/users/:id
 *  @method  GET
 *  @access  private (only admin & user himself)
 */
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

/**
 *  @desc    Delete User
 *  @route   /api/users/:id
 *  @method  DELETE
 *  @access  private (only admin & user himself)
 */
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      await user.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "user deleted" });
    } else {
      res.status(404).json({ message: "user not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

module.exports = router;
