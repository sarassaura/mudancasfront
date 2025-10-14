import { useContext, type JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../../context/user";

function Unauthorized(): JSX.Element {
  
  const { user } = useContext(UserContext)!;
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default Unauthorized;