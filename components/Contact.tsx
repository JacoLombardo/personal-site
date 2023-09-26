/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import styles from "@/styles/homepage.module.css";
import Link from "next/link";
import { Mode } from "@/types";

interface Props {
  theme: Mode;
}

export default function Contact({ theme }: Props) {
  return (
    <>
      <div id="contact" className={styles.contact_div}>
        Let's connect.
        <div>
          <Link href="https://github.com/JacoLombardo" target="_blank">
            <Image
              src={`/Icons/Contact/github-${theme}.png`}
              alt="github"
              title="Github"
              width={30}
              height={30}
            />
          </Link>
          <Link
            href="https://www.linkedin.com/in/jacopo-lombardo/"
            target="_blank"
          >
            <Image
              src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
              alt="linkedin"
              title="LinkedIn"
              width={30}
              height={30}
            />
          </Link>
          <Link href="mailto:jacopo.lombardo@outlook.com" target="_blank">
            <Image
              src="https://res.cloudinary.com/dtl48kr1u/image/upload/v1694426625/personal-site/email_fdma3o.png"
              alt="email"
              title="Email"
              width={30}
              height={30}
            />
          </Link>
          <Link href="/Jacopo Lombardo.pdf" target="_blank">
            <Image
              src="https://res.cloudinary.com/dtl48kr1u/image/upload/v1694426624/personal-site/cv_zec3wq.png"
              alt="cv"
              title="CV"
              width="0"
              height="0"
              sizes="100vw"
              style={{ width: "auto", height: "30px" }}
            />
          </Link>
        </div>
      </div>
    </>
  );
}
