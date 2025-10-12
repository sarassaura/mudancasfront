import type { JSX } from "react";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';

function Layout(): JSX.Element {
  return (
    <>
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">Navbar</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                </Nav>
                <Nav>
                    <Dropdown drop="down-centered">
                        <Dropdown.Toggle id="dropdown-basic" variant="dark">
                            <i className="bi bi-person-circle"></i>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item>Sair</Dropdown.Item>
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