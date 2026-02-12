/* eslint-disable react-hooks/exhaustive-deps */
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styles from "@/styles/homepage.module.css";
import { Mode, Project } from "@/types";
import { DarkModeToggle } from "@anatoliygatt/dark-mode-toggle";

interface Props {
  page: string;
  projects: Project[];
  theme: Mode;
  toggleTheme: Function;
}

const navLinkStyle = (theme: Mode) =>
  theme === "dark" ? { color: "white" } : { color: "black" };

export default function NavBar({ page, projects, theme, toggleTheme }: Props) {
  return (
    <Navbar
      expand="lg"
      data-bs-theme={theme === "dark" ? "dark" : "light"}
      className={styles.navbar}
    >
      <Container className={styles.navbar}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {page !== "home" && (
              <Nav.Link href="/" style={navLinkStyle(theme)}>
                Home
              </Nav.Link>
            )}
            <Nav.Link href="#about" style={navLinkStyle(theme)}>
              About
            </Nav.Link>
            {page === "home" ? (
              <>
                <Nav.Link href="#web-development" style={navLinkStyle(theme)}>
                  Web Development
                </Nav.Link>
                <Nav.Link href="#software-engineering" style={navLinkStyle(theme)}>
                  Software Engineering
                </Nav.Link>
                <Nav.Link href="#42berlin" style={navLinkStyle(theme)}>
                  42Berlin
                </Nav.Link>
              </>
            ) : (
              <NavDropdown
                title={<span style={navLinkStyle(theme)}>Projects</span>}
                id="basic-nav-dropdown"
              >
                {projects?.map((project: Project, index: number) => (
                  <NavDropdown.Item
                    href={`/project/${project.internal_id}`}
                    key={index}
                  >
                    {project.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            )}
            <Nav.Link href="#contact" style={navLinkStyle(theme)}>
              Contact
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <div className={styles.navbar_switch}>
          <DarkModeToggle
            mode={theme}
            dark="dark"
            light="light"
            size="sm"
            inactiveLabelColor="white"
            inactiveTrackColor="white"
            inactiveTrackColorOnHover="#f8fafc"
            inactiveTrackColorOnActive="#cbd5e1"
            activeLabelColor="black"
            activeTrackColor="black"
            activeTrackColorOnHover="#1e293b"
            activeTrackColorOnActive="#0f172a"
            inactiveThumbColor="#1e293b"
            activeThumbColor="white"
            onChange={() => toggleTheme()}
          />
        </div>
      </Container>
    </Navbar>
  );
}
