import { useContext, type JSX } from "react";
import { Outlet } from "react-router-dom";
import UserContext from "../../context/user";

function Unauthorized(): JSX.Element {
  const { user } = useContext(UserContext)!;
  return (
    <>
      {!user ? (
        <>Não Autorizado</>
      ) : (
        <Outlet />
      )}
    </>
  )
}

export default Unauthorized;