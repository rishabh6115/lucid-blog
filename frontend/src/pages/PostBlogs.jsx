import LoadingButton from "@/components/LoadingButton";
import { usePostCreate } from "@/hooks/postHooks";
import { Box, Container, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

const validationSchema = yup.object({
  heading: yup
    .string("Enter Heading")
    .min(6, "Heading should be of minimum 6 characters length")
    .required("Heading is required"),
  content: yup
    .string("Enter Content")
    .min(20, "Content should be of minimum 20 characters length")
    .required("Content is required"),
});

const PostBlogs = () => {
  const { mutateAsync: addPost } = usePostCreate();
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const formik = useFormik({
    initialValues: {
      heading: "",
      content: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const data = await addPost(values);
        if (data) {
          toast.success("Post added successfully");
          setLoading(false);
          nav("/");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to add post");
        console.log(error);
        setLoading(false);
      }
    },
  });

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add a New Blog Post
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            label="Heading"
            variant="outlined"
            sx={{ mb: 2 }}
            id="heading"
            name="heading"
            value={formik.values.heading}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.heading && Boolean(formik.errors.heading)}
            helperText={formik.touched.heading && formik.errors.heading}
          />
          <TextField
            fullWidth
            label="Content"
            variant="outlined"
            multiline
            rows={4}
            sx={{ mb: 2 }}
            id="content"
            name="content"
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.content && Boolean(formik.errors.content)}
            helperText={formik.touched.content && formik.errors.content}
          />
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            isLoading={loading}
          >
            Submit
          </LoadingButton>
        </form>
      </Box>
    </Container>
  );
};

export default PostBlogs;
