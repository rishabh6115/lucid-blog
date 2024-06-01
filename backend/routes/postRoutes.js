const express = require("express");
const { auth } = require("../middlewares/auth");
const router = express.Router();

const {
  createPost,
  updatePost,
  deletePost,
  allPost,
  singleUserPosts,
  addComments,
  singlePost,
} = require("../controllers/postController.js");
const { checkAuthor } = require("../middlewares/checkAuthor.js");

router.route("/").post(auth, createPost).get(allPost);
router.route("/singleuserpost").get(auth, singleUserPosts);
router.route("/addcomment").put(auth, addComments);
router
  .route("/:id")
  .post(auth, checkAuthor, updatePost)
  .delete(auth, checkAuthor, deletePost)
  .get(singlePost);

module.exports = router;
