/* eslint-disable react/prop-types */
import { Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useUserUpdate } from "@/hooks/userHooks";
import toast from "react-hot-toast";
import LoadingButton from "./LoadingButton";
import { useState } from "react";

const validationSchema = yup.object({
  name: yup.string("Enter your name").required("Name is required"),
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
});

const Profile = () => {
  const userObject = useSelector((state) => state.user);

  const { mutateAsync: updatePost } = useUserUpdate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: userObject.user?.name,
      email: userObject.user?.email,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await updatePost(values);
        toast.success("Profile updated successfully");
        setLoading(false);
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update profile"
        );
        setLoading(false);
        console.log(error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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
      </Box>

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
        Update
      </LoadingButton>
    </form>
  );
};

export default Profile;
