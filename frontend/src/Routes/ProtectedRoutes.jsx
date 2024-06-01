import Navbar from "@/components/Navbar";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const isSignedIn = useSelector((state) => state.user.isSignedIn);

  return isSignedIn === true ? (
    <>
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default ProtectedRoutes;
