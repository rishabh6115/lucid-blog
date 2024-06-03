import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
} from "@mui/material";

import LoadingButton from "@/components/LoadingButton";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { usePostDelete, usePostGetUserPosts } from "@/hooks/postHooks";
import LoadingScreen from "@/components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import EditModal from "@/components/EditModal";
import Profile from "@/components/Profile";
import { displayedString, getIndianDate } from "@/utils";
import {
  useUserGetFollowedUsers,
  useUserGetSlackChannels,
  useUserSaveChannelId,
} from "@/hooks/userHooks";
import { useSelector } from "react-redux";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Dashboard() {
  const [value, setValue] = useState(Number(localStorage.getItem("tab")) || 0);
  const { data: followedUsers, isLoading: followedUsersLoading } =
    useUserGetFollowedUsers();
  const { mutateAsync: deletePost } = usePostDelete();
  const { data: slackChannels, isLoading: slackChannelsLoading } =
    useUserGetSlackChannels();
  const { mutateAsync: saveID } = useUserSaveChannelId();
  const [channelIdSaveLoading, setChannelIdSaveLoading] = useState(false);
  const isSlackUser = useSelector((state) => state.user?.user?.isSlack);

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPostId, setCurrentPostId] = useState(null);
  const { data: postResponse, isLoading } = usePostGetUserPosts({
    page: currentPage,
  });
  const [currentDeletingPost, setCurrentDeletingPost] = useState(null);

  const [selectedChannel, setSelectedChannel] = useState("");

  useEffect(() => {
    localStorage.setItem("tab", value);
  }, [value]);

  const channel_id = useSelector((state) => state.user?.user?.channel_id);
  const nav = useNavigate();

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  const handleOpen = (postId) => {
    setCurrentPostId(postId);
  };

  const handleClose = () => {
    setCurrentPostId(null);
  };

  const handleDelete = async (e, post) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await deletePost(post._id);
      setLoading(false);
      toast.success("Post Deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete post");
      console.log(error);
      setLoading(false);
    }
  };
  const handleChannelSave = async () => {
    try {
      setChannelIdSaveLoading(true);
      await saveID({ channel_id: selectedChannel });
      toast.success("Channel id saved successfully.You will receive updates");
      setChannelIdSaveLoading(false);
    } catch (error) {
      setChannelIdSaveLoading(false);
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to save channel id"
      );
    }
  };

  const getValue = (selectedChannel) => {
    if (selectedChannel) return null;
    if (channel_id) {
      return slackChannels?.channels.find(
        (channel) => channel.id === channel_id
      )?.id;
    }
    return null;
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Profile" {...a11yProps(0)} />
          <Tab label="My Blogs" {...a11yProps(1)} />
          <Tab label="Followed Authors" {...a11yProps(2)} />
          {isSlackUser && <Tab label="Slack Channel" {...a11yProps(3)} />}
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Profile />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <>
          <Box sx={{ my: 4 }}>
            <Grid container spacing={3}>
              {postResponse &&
                postResponse.posts.map((post) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={post._id}
                    sx={{ cursor: "pointer" }}
                  >
                    <Card
                      sx={{ height: "100%" }}
                      onClick={() => {
                        if (currentPostId) {
                          return;
                        }
                        nav(`/singleblog/${post._id}`);
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h5"
                          component="div"
                          sx={{ fontWeight: "bold" }}
                        >
                          {displayedString(post.heading, 10)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          {displayedString(post.content, 10)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 2 }}
                        >
                          By {post?.author?.name} on{" "}
                          {getIndianDate(post.createdAt)}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpen(post._id);
                          }}
                        >
                          Edit
                        </Button>
                        <LoadingButton
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={(e) => {
                            setCurrentDeletingPost(post._id);
                            handleDelete(e, post);
                          }}
                          isLoading={
                            loading && currentDeletingPost === post._id
                          }
                        >
                          Delete
                        </LoadingButton>
                      </CardActions>
                      <EditModal
                        post={post}
                        open={currentPostId === post._id}
                        handleClose={handleClose}
                      />
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <Pagination
              count={
                postResponse.totalPost < 10
                  ? 1
                  : Math.ceil(postResponse.totalPost / 10)
              }
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <Box sx={{ my: 4 }}>
          <Grid container spacing={3}>
            {followedUsersLoading && <LoadingScreen />}
            {followedUsers?.following &&
              followedUsers?.following.map((user) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={user._id}
                  sx={{ cursor: "pointer" }}
                >
                  <Card
                    sx={{ height: "100%" }}
                    onClick={() => {
                      nav(`/profile/${user._id}`);
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{ fontWeight: "bold" }}
                      >
                        {user.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        {user.email}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
      </CustomTabPanel>
      {isSlackUser && (
        <CustomTabPanel value={value} index={3}>
          {slackChannelsLoading && <LoadingScreen />}
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h5" sx={{ mb: 4 }}>
                Select a channel
              </Typography>
              {channel_id && (
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  sx={{ alignSelf: "baseline" }}
                >
                  {channel_id}
                </Button>
              )}
            </Box>
            <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Channels</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={getValue(selectedChannel) || selectedChannel}
                  label="Channels"
                  onChange={(e) => setSelectedChannel(e.target.value)}
                >
                  {slackChannels?.channels.map((channel) => (
                    <MenuItem value={channel.id} key={channel.id}>
                      {channel.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {selectedChannel && (
              <LoadingButton
                variant="contained"
                sx={{ mt: 2, minWidth: 200 }}
                onClick={handleChannelSave}
                isLoading={channelIdSaveLoading}
              >
                Save
              </LoadingButton>
            )}
          </Box>
        </CustomTabPanel>
      )}
    </Container>
  );
}

Profile.propTypes = {
  id: PropTypes.string,
};
