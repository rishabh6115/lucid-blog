/* eslint-disable react/prop-types */
import { Button, CircularProgress } from "@mui/material";

const LoadingButton = ({ isLoading = false, children, ...props }) => {
  return (
    <Button {...props}>
      {isLoading ? (
        <CircularProgress sx={{ color: "white" }} size={20} />
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
