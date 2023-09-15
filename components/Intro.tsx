import Image from "next/image";
import styles from "@/styles/homepage.module.css";

export default function Intro() {
  return (
    <>
      <div className={styles.intro_div}>
        <h3>
          Hi, I am Jacopo. A junior Full-Stack Developer, based in Berlin.
        </h3>
        <Image
          src="https://res.cloudinary.com/dtl48kr1u/image/upload/v1694358931/personal-site/DSC02863_owsl4d.jpg"
          alt="pic"
          width="0"
          height="0"
          sizes="100vw"
          style={{ width: "500px", height: "auto" }}
        />
      </div>
    </>
  );
}
