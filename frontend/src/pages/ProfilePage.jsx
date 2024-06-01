/* eslint-disable react/prop-types */
import LoadingScreen from "@/components/LoadingScreen";
import { useUserGetSingle } from "@/hooks/userHooks";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

const ProfilePage = () => {
  const { id } = useParams();
  const { data: response, isLoading } = useUserGetSingle({ id });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
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
