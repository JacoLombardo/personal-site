import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styles from "@/styles/homepage.module.css";

export default function NavBar() {
  return (
    <>
      <Navbar
        expand="lg"
        className={styles.navbar}
        // className={`bg-body-tertiary ${styles.navbar}`}
        data-bs-theme="dark"
        // style={{ backgroundColor: "black", color: "white" }}
      >
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/#about" style={{ color: "white" }}>
                About
              </Nav.Link>
              <Nav.Link href="/#projects" style={{ color: "white" }}>
                Projects
              </Nav.Link>
              <NavDropdown
                title="Projects"
                id="basic-nav-dropdown"
                style={{ color: "white" }}
              >
                <NavDropdown.Item href="#project/1">Project 1</NavDropdown.Item>
                <NavDropdown.Item href="#project/2">Project 2</NavDropdown.Item>
                <NavDropdown.Item href="#project/3">Project 3</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#project/4">Project 4</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="/#contact" style={{ color: "white" }}>
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
