const express = require("express");
const {
  register,
  login,
  getuser,
  updateUser,
  getSingleUser,
  followUser,
  unfollowUser,
  followList,
} = require("../controllers/userController");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/followed-users", auth, followList);
router.get("/:id", getSingleUser);
router.route("/").post(register).get(auth, getuser).put(auth, updateUser);
router.route("/login").post(login);
router.route("/follow/:id").put(auth, followUser);
router.route("/unfollow/:id").put(auth, unfollowUser);

module.exports = router;
