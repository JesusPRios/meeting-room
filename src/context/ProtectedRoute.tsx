import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { PrivateRouteProps } from "../types/privateRouteProps";

const ProtectedRoute = ({ children }: PrivateRouteProps) => {
  const role = Cookies.get("role");

  if (!role || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
