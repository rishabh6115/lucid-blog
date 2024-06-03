const { default: axios } = require("axios");
const expressAsyncHandler = require("express-async-handler");
const User = require("../modals/UserModal");

const getChannels = expressAsyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (!user.isSlack) {
      res.status(400).send("User is not a slack user");
    }
    const response = await axios.get(
      "https://slack.com/api/conversations.list",
      {
        headers: {
          Authorization: `Bearer ${user.bot_user_access_token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    throw new Error(error.message);
  }
});

const saveChannelId = expressAsyncHandler(async (req, res) => {
  try {
    const { channel_id } = req.query;
    if (!channel_id) {
      throw new Error("Channel Id is required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw new Error("User not found");
    }
    user.channel_id = channel_id;
    await user.save();
    res.json(user);
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = { getChannels, saveChannelId };
