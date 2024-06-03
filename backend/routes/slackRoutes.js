const express = require("express");
const { auth } = require("../middlewares/auth");
const {
  getChannels,
  saveChannelId,
} = require("../controllers/slackController");

const router = express.Router();

router.route("/").get(auth, getChannels).post(auth, saveChannelId);

module.exports = router;
