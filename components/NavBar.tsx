/* eslint-disable react-hooks/exhaustive-deps */
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import styles from "@/styles/homepage.module.css";
import { useContext, useEffect } from "react";
import { ProjectContext } from "@/contexts/ProjectContext";
import { Project } from "@/types/project";

interface Props {
  page: string;
}

export default function NavBar({ page }: Props) {
  const { projects, getProjects } = useContext(ProjectContext);

  useEffect(() => {
    getProjects();
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        // className={styles.navbar}
        // className={`bg-body-tertiary ${styles.navbar}`}
        data-bs-theme="dark"
        // style={{ backgroundColor: "black", color: "white" }}
      >
        <Container className={styles.navbar}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {page === "home" ? (
                <Nav.Link href="#about" style={{ color: "white" }}>
                  About
                </Nav.Link>
              ) : (
                <Nav.Link href="/" style={{ color: "white" }}>
                  Home
                </Nav.Link>
              )}
              {page === "home" ? (
                <Nav.Link href="#projects" style={{ color: "white" }}>
                  Projects
                </Nav.Link>
              ) : (
                <NavDropdown
                  title={<span style={{ color: "white" }}>Projects</span>}
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
              <Nav.Link href="#contact" style={{ color: "white" }}>
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
