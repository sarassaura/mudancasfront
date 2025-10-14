import { useContext, type JSX } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../../context/user";

function UnauthorizedEmployee(): JSX.Element {
  
  const { user } = useContext(UserContext)!;
  if (!user?.admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default UnauthorizedEmployee;