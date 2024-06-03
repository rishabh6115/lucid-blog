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
import { useUserSignup } from "@/hooks/userHooks";
import { useDispatch } from "react-redux";
import { signIn } from "@/store/slices/userSlice";
import { useState } from "react";
import toast from "react-hot-toast";
import LoadingButton from "@/components/LoadingButton";

const validationSchema = yup.object({
  name: yup.string("Enter your name").required("Name is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const Signup = () => {
  const { mutateAsync: registerUser } = useUserSignup();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const data = await registerUser(values);
        if (data?._id) {
          dispatch(signIn(data));
          setLoading(false);
          toast.success("Account created successfully");
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
          Sign up
        </Typography>
        <Box noValidate sx={{ mt: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  fullWidth
                  id="name"
                  label="Full Name"
                  autoFocus
                  sx={{ mt: 1, mb: 1 }}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  sx={{ mt: 1, mb: 1 }}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  sx={{ mt: 1, mb: 1 }}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  helperText={formik.touched.password && formik.errors.password}
                />
              </Grid>
            </Grid>
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
              Sign Up
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
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Signup;
