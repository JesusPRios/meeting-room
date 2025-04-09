import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { PrivateRouteProps } from "../types/privateRouteProps";

const ProtectedRoute = ({ children }: PrivateRouteProps) => {
  const isAuthenticated = Cookies.get("role");
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;