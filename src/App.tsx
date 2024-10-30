import {
  HashRouter as Router,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import theme from "./theme";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";

import "./App.css";
import CreatePost from "./pages/create-post/CreatePost";
import Detail from "./pages/detail/Detail";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import EditPost from "./pages/edit-post/EditPost";
import Listing from "./pages/listing/Listing";
import Notification from "./pages/notification/Notification";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./utils/ProtectedRoute";
import Loading from "./components/loading/Loading";
import NotificationItem from "./components/notification-item/NotificationItem";

function App() {
  const role = localStorage.getItem("role");

  const isAuthenticated = !!localStorage.getItem("token");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "register",
      element: <Register />,
    },
    {
      path: "create-post",
      element: (
        <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login">
          <CreatePost />
        </ProtectedRoute>
      ),
    },
    {
      path: "edit-post/:slug",
      element: <EditPost />,
    },
    {
      path: "detail/:slug",
      element: <Detail />,
    },
    {
      path: "admin/dashboard",
      element: (
        <ProtectedRoute
          isAllowed={
            isAuthenticated &&
            (role === "ROLE_VOLUNTEER" || role === "ROLE_ADMIN")
          }
          redirectPath="/"
        >
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "listing",
      element: (
        <ProtectedRoute isAllowed={isAuthenticated} redirectPath="/login">
          <Listing />
        </ProtectedRoute>
      ),
    },
    {
      path: "notification",
      element: <Notification />,
    },
    {
      path: "profile",
      element: <Profile />,
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <Loading />
      <NotificationItem />
    </ThemeProvider>
  );
}

export default App;
