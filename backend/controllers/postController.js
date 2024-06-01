const asyncHandler = require("express-async-handler");
const Post = require("../modals/PostModal");
const Comment = require("../modals/commentModal");
const User = require("../modals/UserModal");

const createPost = asyncHandler(async (req, res) => {
  try {
    const { heading, content } = req.body;
    if (!heading || !content) {
      throw new Error("Please enter all the details");
    }
    const post = await Post.create({
      heading,
      content,
      author: req.user._id,
    });

    if (post) {
      res.status(201).json({ message: "Post created Successfully" });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const updatePost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Post Id is required");
    }
    const post = await Post.findById(id);

    await post.updateOne({ $set: req.body });

    res.status(201).json({ message: "updation successful" });
  } catch (error) {
    throw new Error(error.message);
  }
});

const deletePost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Post Id is required");
    }
    await Post.findByIdAndDelete(id);

    res.status(201).json({ message: "deletion successful" });
  } catch (error) {
    throw new Error(error.message);
  }
});

const allPost = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    let keyword = req.query.search
      ? {
          heading: { $regex: req.query.search, $options: "i" },
        }
      : {};

    const totalPost = await Post.countDocuments(keyword);

    let posts = await Post.find(keyword)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate("author", "-password")
      .sort({ createdAt: -1 });

    if (posts) {
      res.status(201).json({ posts, totalPost });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const singleUserPosts = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const query = { author: { $eq: req.user._id } };

    const totalPost = await Post.countDocuments(query);

    let singleUserPosts = await Post.find(query)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("author", "-password")
      .populate("comments");

    singleUserPosts = await User.populate(singleUserPosts, {
      path: "comments.author",
    });

    if (singleUserPosts) {
      res.status(201).json({ posts: singleUserPosts, totalPost });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const addComments = asyncHandler(async (req, res) => {
  try {
    const { postId, content } = req.body;
    if (!postId || !content) {
      throw new Error("Please enter all the feilds");
    }
    const author = req.user._id;

    const comment = await Comment.create({ content, author });
    if (!comment) {
      throw new Error("Unable to create comment");
    }
    const post = await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    if (!post) {
      res.status(400);
      throw new Error("Post not found");
    }

    res.status(201).json({ message: "Comment added" });
  } catch (error) {
    throw new Error(error.message);
  }
});

const singlePost = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new Error("Post Id is requried");
    }
    let post = await Post.findById(id).populate("comments").populate("author");

    post = await User.populate(post, {
      path: "comments.author",
    });
    if (!post) {
      res.status(400);
      throw new Error("Post not found");
    }
    res.status(201).json(post);
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = {
  createPost,
  updatePost,
  deletePost,
  allPost,
  singleUserPosts,
  addComments,
  singlePost,
};
