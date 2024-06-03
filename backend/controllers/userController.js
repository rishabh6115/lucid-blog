const User = require("../modals/UserModal");
const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/generateToken");

const register = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new Error("Please Enter All the feilds");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new Error("User Already Exists");
    }

    //password hashing is done in UserModal.js
    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        following: user.following,
        followers: user.followers,
        token: token,
      });
    } else {
      res.status("400");
      throw new Error("Failed to create user");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please enter all the feilds");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    if (await user.matchPassword(password)) {
      const token = generateToken(user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        following: user.following,
        followers: user.followers,
        token: token,
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const getuser = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      throw new error("Unauthorized");
    }

    res.send(req.user);
  } catch (error) {
    throw new Error(error.message);
  }
});

const updateUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    await user.save();
    res.json("User Updated");
  } catch (error) {
    throw new Error(error.message);
  }
});

const getSingleUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user);
  } catch (error) {
    throw new Error(error.message);
  }
});

const followUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("User Id is required");
    }

    if (req.user._id.toString() === id) {
      res.status(400);
      throw new Error("You cannot follow yourself");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.followers.includes(req.user._id)) {
      res.status(400);
      throw new Error("Already following the user");
    }

    user.followers.push(req.user._id);

    const currentUser = await User.findById(req.user._id);
    currentUser.following.push(user._id);

    await Promise.all([user.save(), currentUser.save()]);

    res.json("User Followed");
  } catch (error) {
    throw new Error(error.message);
  }
});

const unfollowUser = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("User Id is required");
    }

    if (req.user._id.toString() === id) {
      res.status(400);
      throw new Error("You cannot unfollow yourself");
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (!user.followers.includes(req.user._id)) {
      res.status(400);
      throw new Error("User not followed yet");
    }

    user.followers = user.followers.filter(
      (follower) => follower?.toString() !== req.user._id.toString()
    );

    const currentUser = await User.findById(req.user._id);
    currentUser.following = currentUser.following.filter(
      (following) => following?.toString() !== user._id.toString()
    );

    await Promise.all([user.save(), currentUser.save()]);
    res.json("User Unfollowed");
  } catch (error) {
    throw new Error(error.message);
  }
});

const followList = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("following");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json({ following: user.following });
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = {
  register,
  login,
  getuser,
  updateUser,
  getSingleUser,
  followUser,
  unfollowUser,
  followList,
};
