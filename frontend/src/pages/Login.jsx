import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useUserLogin } from "@/hooks/userHooks";
import { signIn } from "@/store/slices/userSlice";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string("Enter your password").required("Password is required"),
});

const Login = () => {
  const { mutateAsync: loginUser } = useUserLogin();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const data = await loginUser(values);
        if (data?._id) {
          dispatch(signIn(data));
          setLoading(false);
          toast.success("Signed successfully");
          nav("/");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong!");
        console.log(error);
        setLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box sx={{ mt: 1 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              sx={{ mt: 2, mb: 2 }}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              sx={{ mt: 2, mb: 2 }}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{
                mt: 3,
                mb: 2,
                padding: "10px 0",
                fontSize: "16px",
              }}
              isLoading={loading}
            >
              Sign In
            </LoadingButton>
          </form>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mb: 2, padding: "10px 0", fontSize: "16px" }}
            onClick={(event) => {
              event.preventDefault();
              window.location.href = `${
                import.meta.env.VITE_BACKEND_URL_SLACK
              }/auth/slack`;
            }}
          >
            Login with Slack
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/signup" variant="body2">
                Do not have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
