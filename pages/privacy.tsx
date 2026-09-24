import Head from "next/head";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import clientPromise from "@/lib/mongodb";
import styles from "@/styles/project.module.css";

interface ContentDoc {
  name?: string;
  linkedin?: string;
}

interface Props {
  intro: { name: string } | null;
  contact: { linkedin: string } | null;
}

export default function Privacy({ intro, contact }: Props) {
  const navIntro = intro ? { name: intro.name } : undefined;
  const navContact = contact ? { linkedin: contact.linkedin } : undefined;

  return (
    <>
      <Head>
        <title>Privacy | Jacopo Lombardo</title>
      </Head>
      <NavBar page="project" intro={navIntro} contact={navContact} />
      <main className={styles.project_page_main}>
        <article className={styles.project_article}>
          <h1 className={styles.project_title}>Privacy</h1>
          <div className={styles.project_description}>
            <p>
              This site records a single visit per browser session to understand how it&apos;s used. We store only: the page you opened, where you came from (referrer), browser type, time of visit, and optionally language, timezone, and screen size. No cookies are used for this; we rely on your browser session. Data is not shared with third parties. If you have questions, <Link href="/#contact">get in touch</Link>.
            </p>
          </div>
        </article>
      </main>
    </>
  );
}

export async function getStaticProps() {
  const client = await clientPromise;
  const db = client.db("personal-site");
  const contentColl = db.collection("content");
  const [introDoc, contactDoc] = await Promise.all([
    contentColl.findOne({ _id: "intro" } as Record<string, unknown>),
    contentColl.findOne({ _id: "contact" } as Record<string, unknown>),
  ]);
  const intro = introDoc && "name" in introDoc ? { name: (introDoc as ContentDoc).name ?? "" } : null;
  const contact = contactDoc && "linkedin" in contactDoc ? { linkedin: (contactDoc as ContentDoc).linkedin ?? "" } : null;
  return { props: { intro, contact } };
}
