import {
  Route,
  Routes,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import Homepage from "./pages/Homepage";
import { Toaster } from "react-hot-toast";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import PublicRoutes from "./Routes/PublicRoutes";
import { CssBaseline } from "@mui/material";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostBlogs from "./pages/PostBlogs";
import { useEffect } from "react";
import { useUserGet } from "./hooks/userHooks";
import { useDispatch } from "react-redux";
import { signIn } from "@/store/slices/userSlice";
import Dashboard from "./pages/Dashboard";
import LoadingScreen from "./components/LoadingScreen";
import SingleBlog from "./pages/SingleBlog";
import NonCheckRoutes from "./Routes/NonCheckRoutes";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading } = useUserGet();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(signIn(data));
    } else if (searchParams.get("user")) {
      dispatch(signIn(JSON.parse(searchParams.get("user"))));
      setSearchParams();
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Toaster />
      <CssBaseline />
      <Routes>
        <Route element={<NonCheckRoutes />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/singleblog/:id" element={<SingleBlog />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/post-blog" element={<PostBlogs />} />
          <Route path="/Dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
