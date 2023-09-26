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

export default function NavBar({ page, projects, theme, toggleTheme }: Props) {
  return (
    <>
      <Navbar
        expand="lg"
        data-bs-theme={theme === "dark" ? "dark" : "light"}
        className={styles.navbar}
      >
        <Container className={styles.navbar}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {page === "home" ? (
                <Nav.Link
                  href="#about"
                  style={
                    theme === "dark" ? { color: "white" } : { color: "black" }
                  }
                >
                  About
                </Nav.Link>
              ) : (
                <Nav.Link
                  href="/"
                  style={
                    theme === "dark" ? { color: "white" } : { color: "black" }
                  }
                >
                  Home
                </Nav.Link>
              )}
              {page === "home" ? (
                <Nav.Link
                  href="#projects"
                  style={
                    theme === "dark" ? { color: "white" } : { color: "black" }
                  }
                >
                  Projects
                </Nav.Link>
              ) : (
                <NavDropdown
                  title={
                    <span
                      style={
                        theme === "dark"
                          ? { color: "white" }
                          : { color: "black" }
                      }
                    >
                      Projects
                    </span>
                  }
                  id="basic-nav-dropdown"
                >
                  {projects &&
                    projects.map((project: Project, index: number) => {
                      return (
                        <NavDropdown.Item
                          href={`/project/${project.internal_id}`}
                          key={index}
                        >
                          {project.name}
                        </NavDropdown.Item>
                      );
                    })}
                </NavDropdown>
              )}
              <Nav.Link
                href="#contact"
                style={
                  theme === "dark" ? { color: "white" } : { color: "black" }
                }
              >
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
              onChange={() => {
                toggleTheme();
              }}
            />
          </div>
        </Container>
      </Navbar>
    </>
  );
}
