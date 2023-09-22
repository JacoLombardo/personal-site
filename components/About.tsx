import styles from "@/styles/homepage.module.css";

export default function About() {
  return (
    <>
      <div id="about" className={styles.about_div}>
        About:
        <div>
          <p>
            After many years working as kitchen chef, I recently decided to move
            to tech and I attended a 5 months Full Stack Development bootcamp at
            Codac Berlin. The course gave me all the tools and knowledge to
            enter this new world, and now I cannot stop looking for more.
          </p>
          <p style={{ color: "grey" }}>
            During my background in gastronomy, I strengthened my stress and
            team management skills, enhancing my efficiency and time management
            abilities. These transferable skills are instrumental in maintaining
            focus and meeting deadlines.
          </p>
        </div>
      </div>
    </>
  );
}
