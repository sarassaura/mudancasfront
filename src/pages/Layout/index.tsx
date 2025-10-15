import { useContext, useEffect, useState, type JSX } from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo.svg';
import UserContext from "../../context/user";

function Layout(): JSX.Element {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const { user, setUser } = useContext(UserContext)!;
  const [isLogoutHover, setIsLogoutHover] = useState(false); 

  const signOut = () => {
    localStorage.removeItem('user');
    setUser(null);
  }

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 992);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
}, []);

const theme = isMobile ? "light" : "dark";
const HOVER_DARKER_COLOR = '#4d5154';

const logoutItemStyle = {
    backgroundColor: isLogoutHover ? HOVER_DARKER_COLOR : 'transparent',
    color: 'white',
};

  return (
    <>
        <Navbar style={{ backgroundColor: '#C9CCCE' }} data-bs-theme={theme} expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={Logo} 
                        alt="Logo da Empresa"
                        height="50" 
                        className="d-inline-block align-top"
                    />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />

                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link style={{ color: '#EC3239' }} as={Link} to="/">Início</Nav.Link>
                    {user?.admin && (
                        <Nav.Link className="text-dark" as={Link} to="/cadastrar">Cadastrar</Nav.Link>
                    )}
                    <Nav.Link className="text-dark" as={Link} to="/pedidos-mudanca">Pedidos de Mudança</Nav.Link>
                    <Nav.Link className="text-dark" as={Link} to="/premiacoes">Premiações</Nav.Link>
                </Nav>
                </Navbar.Collapse>

                <Nav className="ms-auto ms-lg-0">
                    <Dropdown drop="down">
                        <Dropdown.Toggle id="dropdown-basic" variant="dark">
                            <i className="bi bi-person-circle"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item 
                            onClick={signOut}
                            style={logoutItemStyle}
                            onMouseEnter={() => setIsLogoutHover(true)}
                            onMouseLeave={() => setIsLogoutHover(false)}
                            active={false} 
                            >
                                Sair
                            </Dropdown.Item>
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