/* eslint-disable react/prop-types */
import LoadingButton from "@/components/LoadingButton";
import LoadingScreen from "@/components/LoadingScreen";
import {
  useUserFollow,
  useUserGetSingle,
  useUserUnfollow,
} from "@/hooks/userHooks";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { id } = useParams();
  const { data: response, isLoading } = useUserGetSingle({ id });
  const { mutateAsync: followUser } = useUserFollow();
  const { mutateAsync: unfollowUser } = useUserUnfollow();
  const following = useSelector((state) => state.user.user?.following);
  const [loading, setLoading] = useState(false);
  const isFollowing = following?.includes(id);
  const checkSameAUthor = id === useSelector((state) => state.user.user?._id);
  const handleClick = async () => {
    try {
      setLoading(true);
      if (isFollowing) {
        await unfollowUser({ id });
        toast.success("User unfollowed successfully");
      } else {
        await followUser({ id });
        toast.success("User followed successfully");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Failed to follow/unfollow user"
      );
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        {!checkSameAUthor && (
          <LoadingButton
            variant="contained"
            onClick={handleClick}
            isLoading={loading}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </LoadingButton>
        )}
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          autoComplete="given-name"
          name="name"
          fullWidth
          id="name"
          label="Full Name"
          autoFocus
          sx={{ mt: 1, mb: 1 }}
          value={response?.name || ""}
          disabled={true}
        />
        <TextField
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          sx={{ mt: 1, mb: 1 }}
          value={response?.email || ""}
          disabled={true}
        />
      </Box>
    </Container>
  );
};

export default ProfilePage;
