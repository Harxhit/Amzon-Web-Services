import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LoadingScreen } from "../components";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) return <LoadingScreen/>;

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return <Outlet/>;
};

export default ProtectedLayout;
