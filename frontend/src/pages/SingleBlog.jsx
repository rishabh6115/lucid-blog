import LoadingScreen from "@/components/LoadingScreen";
import { usePostAddComment, usePostGetSingle } from "@/hooks/postHooks";
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  TextField,
  Paper,
  Grid,
  Container,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";
import { getIndianDate } from "@/utils";

const Blogs = () => {
  const { id } = useParams();
  const { data: singleBlog, isLoading } = usePostGetSingle(id);
  const [newComment, setNewComment] = useState("");
  const isSingedIn = useSelector((state) => state.user.isSignedIn);
  const { mutateAsync: addComment } = usePostAddComment();
  const [loading, setLoading] = useState(false);

  const handleCommentSubmit = async () => {
    try {
      setLoading(true);
      const dataToSend = {
        content: newComment,
        postId: id,
      };
      await addComment(dataToSend);
      toast.success("Comment added successfully");
      setNewComment("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast.error(error?.response?.data?.message || "Failed to add comment");
    }
  };

  if (isLoading || !singleBlog) {
    return <LoadingScreen />;
  }
  console.log(singleBlog);
  return (
    <Container maxWidth="lg" sx={{ py: 3, wordBreak: "break-word" }} p={2}>
      <Typography variant="h4" gutterBottom>
        {singleBlog.heading}
      </Typography>
      <Typography variant="body1" paragraph>
        {singleBlog.content}
      </Typography>
      <Box my={3}>
        <Divider />
        <Typography variant="h5" mt={3} mb={2}>
          Comments
        </Typography>
        {singleBlog.comments.map((comment, index) => (
          <Paper key={index} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item xs display={"flex"} justifyContent="space-between">
                <Typography variant="body2">
                  <strong>{comment.author.name}:</strong> {comment.content}
                </Typography>
                <Typography variant="caption">
                  Created At : {getIndianDate(comment.createdAt)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
      {isSingedIn && (
        <Box mt={3}>
          <Typography variant="h5">Add a Comment</Typography>
          <Divider />
          <TextField
            label="Your Comment"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{ mt: 2 }}
          />
          <LoadingButton
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={handleCommentSubmit}
            disabled={!newComment.trim()}
            sx={{ mt: 2 }}
            isLoading={loading}
          >
            Submit
          </LoadingButton>
        </Box>
      )}
      <Box mt={3}>
        <Link to={`/profile/${singleBlog.author._id}`}>
          Visit Authors Profile
        </Link>
      </Box>
    </Container>
  );
};

export default Blogs;
