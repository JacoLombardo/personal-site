import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import styles from "@/styles/homepage.module.css";

interface NavIntro {
  name: string;
}

interface NavContact {
  linkedin: string;
}

interface Props {
  page: string;
  intro?: NavIntro;
  contact?: NavContact;
}

const navLinkStyle = { color: "white" };

function LinkedInIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={styles.navbar_linkedin_svg}
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function NavBar({ page, intro, contact }: Props) {
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const name = intro?.name ?? "Jacopo Lombardo";
  const linkedinUrl = contact?.linkedin ?? "https://www.linkedin.com/in/jacopo-lombardo/";

  const TOP_THRESHOLD = 60;
  const lastScrollY = useRef(0);

  const closeMenu = () => setExpanded(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y <= TOP_THRESHOLD) {
        setHidden(false);
      } else if (y > lastScrollY.current) {
        setHidden(true);
      } else if (y < lastScrollY.current) {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = !hidden || hovered;

  /* From project (or other) pages, nav links must go to homepage + section. */
  const base = page === "home" ? "" : "/";

  return (
    <>
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
        expanded={expanded}
        onToggle={(next) => setExpanded(next)}
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
        <Container className={styles.navbar_container}>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className={styles.navbar_toggle} />
          <div className={styles.navbar_brand_center}>
            <Navbar.Brand as={Link} href="/" className={styles.navbar_brand}>
              {name}
            </Navbar.Brand>
          </div>
          <div className={styles.navbar_toggle_spacer} aria-hidden="true" />
          <Navbar.Collapse id="basic-navbar-nav" className={styles.navbar_collapse}>
            <Nav className={styles.navbar_nav}>
              <Nav.Link href={`${base}#projects`} style={navLinkStyle} onClick={closeMenu}>
                Projects
              </Nav.Link>
              <Nav.Link href={`${base}#technologies`} style={navLinkStyle} onClick={closeMenu}>
                Technologies
              </Nav.Link>
              <Nav.Link href={`${base}#about`} style={navLinkStyle} onClick={closeMenu}>
                About
              </Nav.Link>
              <Nav.Link href={`${base}#cv`} style={navLinkStyle} onClick={closeMenu}>
                CV
              </Nav.Link>
              <Nav.Link href={`${base}#contact`} style={navLinkStyle} onClick={closeMenu}>
                Contact
              </Nav.Link>
            </Nav>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navbar_linkedin}
              aria-label="LinkedIn profile"
            >
              <LinkedInIcon />
            </a>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
