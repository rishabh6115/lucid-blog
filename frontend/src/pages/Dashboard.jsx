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
  Grid,
  Pagination,
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

  const { mutateAsync: deletePost } = usePostDelete();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPostId, setCurrentPostId] = useState(null);
  const { data: postResponse, isLoading } = usePostGetUserPosts({
    page: currentPage,
  });
  const [currentDeletingPost, setCurrentDeletingPost] = useState(null);

  useEffect(() => {
    localStorage.setItem("tab", value);
  }, [value]);

  console.log(localStorage.getItem("tab"));

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
                          By {post.author.name} on{" "}
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
    </Container>
  );
}

Profile.propTypes = {
  id: PropTypes.string,
};
