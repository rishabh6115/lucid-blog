const express = require("express");
const {
  register,
  login,
  getuser,
  updateUser,
  getSingleUser,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/:id", getSingleUser);
router.route("/").post(register).get(auth, getuser).put(auth, updateUser);
router.route("/login").post(login);

module.exports = router;
