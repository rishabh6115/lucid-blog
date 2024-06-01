/* eslint-disable react/prop-types */
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import { useFormik } from "formik";
import Modal from "@mui/material/Modal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { TextField } from "@mui/material";
import LoadingButton from "./LoadingButton";
import { usePostUpdate } from "@/hooks/postHooks";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: 500,
  borderRadius: 2,
  bgcolor: "background.paper",
  boxShadow: 24,
  px: 4,
  py: 0,
  wordBreak: "break-word",
};

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

export default function EditModal({ post, handleClose, open }) {
  const { mutateAsync: editPost } = usePostUpdate();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      heading: post.heading,
      content: post.content,
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const data = await editPost({ id: post._id, post: values });
        if (data) {
          toast.success("Post Edited successfully");
          setLoading(false);
        }
        handleClose();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to Edit post");
        console.log(error);
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box sx={{ my: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Edit blog Post
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
                rows={8}
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
                Update
              </LoadingButton>
            </form>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
