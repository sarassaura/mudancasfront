import { useContext, type JSX } from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.svg';
import UserContext from "../../context/user";

function Layout(): JSX.Element {
  const { user, setUser } = useContext(UserContext)!;
  const signOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  }
  return (
    <>
        <Navbar bg="light" data-bs-theme="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={Logo} 
                        alt="Logo da Empresa"
                        height="50" 
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link className="text-dark" as={Link} to="/">Início</Nav.Link>
                    {user?.admin && (
                        <Nav.Link className="text-dark" as={Link} to="/cadastrar">Cadastrar</Nav.Link>
                    )}
                    <Nav.Link className="text-dark" as={Link} to="/pedidos-mudanca">Pedidos de Mundança</Nav.Link>
                    <Nav.Link className="text-dark" as={Link} to="/premiacoes">Premiações</Nav.Link>
                </Nav>
                <Nav>
                    <Dropdown drop="down-centered">
                        <Dropdown.Toggle id="dropdown-basic" variant="dark">
                            <i className="bi bi-person-circle"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={signOut}>Sair</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Nav>
            </Container>
        </Navbar>
        <Container as="main" className="d-flex my-auto">
            <Outlet />
         </Container>
    </>
  )
}

export default Layout;