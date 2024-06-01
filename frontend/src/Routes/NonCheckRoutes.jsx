import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const NonCheckRoutes = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default NonCheckRoutes;
