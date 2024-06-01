import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoutes = () => {
  const isSignedIn = useSelector((state) => state.user.isSignedIn);

  return isSignedIn === false ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default PublicRoutes;
