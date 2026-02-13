/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "next/image";
import styles from "@/styles/homepage.module.css";

interface Props {
  page: string;
}

const navLinkStyle = { color: "white" };
const LOGO_URL =
  "https://res.cloudinary.com/dtl48kr1u/image/upload/v1694445159/personal-site/j_nx7enz.png";

export default function NavBar({ page }: Props) {
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(false);

  const TOP_THRESHOLD = 60; // px from top to show navbar again

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= TOP_THRESHOLD) {
        setHidden(false);
      } else {
        setHidden(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once in case we're already at top
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = !hidden || hovered;

  return (
    <>
      {/* Invisible hover zone at the top to trigger reveal */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 24,
          zIndex: 1001,
        }}
        onMouseEnter={() => setHovered(true)}
      />
      <Navbar
        expand="lg"
        data-bs-theme="dark"
        className={styles.navbar}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transform: visible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.35s ease",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Container className={styles.navbar}>
          <Navbar.Brand href={page === "home" ? "#" : "/"} className="me-3">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "white",
              }}
            >
              <Image
                src={LOGO_URL}
                alt="Home"
                width={24}
                height={24}
              />
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#about" style={navLinkStyle}>
                About
              </Nav.Link>
              <Nav.Link href="#first-circle" style={navLinkStyle}>
                Projects
              </Nav.Link>
              <Nav.Link href="#contact" style={navLinkStyle}>
                Contact
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
