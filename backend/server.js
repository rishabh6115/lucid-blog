const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const slackRoutes = require("./routes/slackRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { default: axios } = require("axios");
const generateToken = require("./utils/generateToken");
const User = require("./modals/UserModal");
const clientId = process.env.SLACK_CLIENT_ID;
const clientSecret = process.env.SLACK_CLIENT_SECRET;
const redirectUri = process.env.SLACK_REDIRECT_URI;

connectDB();
dotenv.config();

app.use(express.json());
app.use(cors());

app.get("/auth/slack", (req, res) => {
  const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=chat:write.public%20channels:read%20chat:write&user_scope=identity.basic%20identity.email&redirect_uri=${redirectUri}`;
  res.redirect(slackAuthUrl);
});

app.get("/auth/slack/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.get("https://slack.com/api/oauth.v2.access", {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      },
    });
    const { authed_user } = response.data;

    const userResponse = await axios.get(
      "https://slack.com/api/users.identity",
      {
        headers: {
          Authorization: `Bearer ${authed_user.access_token}`,
        },
      }
    );

    const user = userResponse.data.user;
    const { name, email } = user;

    const userExists = await User.findOne({ email });
    if (userExists) {
      const token = generateToken(userExists._id);
      const data = {
        ...userExists._doc,
        token: token,
      };

      res.redirect(
        `${process.env.FRONTEND_URL}?slackAuth=success&user=${JSON.stringify(
          data
        )}`
      );
      return;
    }

    const createdUser = await User.create({
      name,
      email,
      user_access_token: authed_user.access_token,
      bot_user_access_token: response.data.access_token,
      isSlack: true,
    });

    if (!createdUser) {
      res.status("400");
      throw new Error("Failed to create user");
    }
    const token = generateToken(createdUser._id);

    const data = {
      ...createdUser._doc,
      token: token,
    };

    res.redirect(
      `http://localhost:5173?slackAuth=success&user=${JSON.stringify(data)}`
    );
  } catch (error) {
    console.log(error);
    res.send("Error authenticating with Slack");
  }
});

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/slack", slackRoutes);

app.get("/", (req, res) => {
  res.send("API is running..");
});

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Sever running on port ${port}`);
});
