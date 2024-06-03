import { useState, useEffect } from "react";
import { usePostGet } from "@/hooks/postHooks";
import {
  Box,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  Pagination,
  Grid,
} from "@mui/material";
import LoadingScreen from "@/components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import { displayedString, getIndianDate } from "@/utils";

const Homepage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: postResponse, isLoading } = usePostGet({
    search: searchQuery,
    page: currentPage,
  });
  const nav = useNavigate();

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (searchQuery) {
      setCurrentPage(1);
    }
  }, [searchQuery]);

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <TextField
          fullWidth
          label="Search by Title"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
        />
      </Box>

      {isLoading ? (
        <LoadingScreen />
      ) : (
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
                    onClick={() => {
                      nav(`/singleblog/${post._id}`);
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    <Card sx={{ height: "100%" }}>
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
                          {displayedString(post.content, 25)}
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
      )}
    </Container>
  );
};

export default Homepage;
