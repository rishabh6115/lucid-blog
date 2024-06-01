const expressAsyncHandler = require("express-async-handler");
const Post = require("../modals/PostModal");

const checkAuthor = expressAsyncHandler(async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized");
    }
    if (!req.params.id) {
      res.status(400);
      throw new Error("Post Id is required");
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("No post found with post id");
    }

    if (!post.author.equals(req.user._id)) {
      throw new Error(
        "Access Denied! You can only update/delete your own post"
      );
    }
    next();
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = { checkAuthor };
