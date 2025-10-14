import { useContext, type JSX } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserContext from "../../context/user";
import { Button, Container } from "react-bootstrap";

function Unauthorized(): JSX.Element {
  const navigate = useNavigate();
  
  const { user } = useContext(UserContext)!;
  return (
    <>
      {!user ? (
        <Container className="d-flex my-auto justify-content-center flex-column gap-5">
          <h1 className="h1 fw-bold text-primary text-center">Não Autorizado</h1>
          <Button
            variant="primary"
            type="button"
            className="col-6 mx-auto"
            size="lg"
            style={{ width: "200px" }}
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Container>
      ) : (
        <Outlet />
      )}
    </>
  )
}

export default Unauthorized;