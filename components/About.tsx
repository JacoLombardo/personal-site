import styles from "@/styles/homepage.module.css";

export default function About() {
  return (
    <>
      <div id="about" className={styles.about_div}>
        About:
        <div>
          <p>
            When I was little I had two passions, computers and cooking. To
            shape my path I decided to follow the second and I started a career
            as chef that brought me in kitchens in Ireland, Denmark, Germany
            and, of course, Italy. But gastronomy is a tough and everchanging
            sector, and witnessing the new direction I eventually lost passion
            and decided to move to something else. And that’s when I decided to
            go back to the origins and I enrolled in a Full Stack Web
            Development course. I loved it, coding is the perfect food for my
            logical mind!
          </p>
          <p style={{ color: "grey" }}>
            Currently I’m working on both widening my tech knowledge and
            improving my German skills. I’m a passionate and motivated person,
            goal-oriented but not too self-focused. I find myself very
            comfortable in collaborative working in groups, as I manage to get
            the best out of it.
          </p>
        </div>
      </div>
    </>
  );
}
