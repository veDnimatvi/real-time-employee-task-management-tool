import { Navigate, useLocation, useRoutes } from "react-router-dom";
import path from "./path";
import { isAuthenticated } from "../utils/help";
import AdminLayout from "../shared/layouts/AdminLayout";
import AuthLayout from "../shared/layouts/AuthLayout";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import User from "../components/User/User";
import VerifyEmail from "../components/VerifyEmail/VerifyEmail";
import LoginEmployee from "../components/LoginEmployee/LoginEmployee";
import Task from "../components/Task/Task";
import Message from "../components/Message/Message";

function Router() {
  const location = useLocation();
  return useRoutes([
    {
      path: path.ROOT,
      element: isAuthenticated() ? (
        <AdminLayout />
      ) : (
        <Navigate to={path.LOGIN} state={{ from: location }} />
      ),
      children: [
        { element: <Dashboard />, path: path.ROOT },
        { element: <User />, path: path.MANAGE_USER },
        { element: <Task />, path: path.MANAGE_TASK },
        { element: <Message />, path: path.MESSAGE },
      ],
    },
    {
      path: path.ROOT,
      element: <AuthLayout />,
      children: [
        {
          path: path.LOGIN,
          element: isAuthenticated() ? (
            <Navigate to={path.ROOT} state={{ from: location }} />
          ) : (
            <Login />
          ),
        },
        {
          element: <VerifyEmail />,
          path: path.VERIFY_EMAIL,
        },
        {
          element: <LoginEmployee />,
          path: path.LOGIN_EMPLOYEE,
        },
      ],
    },
    { path: path.all, element: <Navigate to={path.NOT_FOUND} replace /> },
  ]);
}

export default Router;
