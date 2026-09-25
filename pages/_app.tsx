import "../styles/bootstrap.scss";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { MotionConfig } from "framer-motion";
import { Poppins } from "next/font/google";
import "../styles/global.css";
import VisitLogger from "@/components/VisitLogger";
import { SITE_DESCRIPTION, SITE_IMAGE, SITE_NAME, SITE_TITLE, SITE_URL } from "@/lib/site";

// Browser-only: the stars are random, so server and browser would render different ones,
// and 300 circles would add ~55 KB to every page's HTML.
const StarBackground = dynamic(() => import("@/components/layout/StarBackground"), { ssr: false });

// Self-hosted at build time as woff2, with the real weights the CSS uses (400 to 700).
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

export default function MyApp({ Component, pageProps }: any) {
  const { asPath } = useRouter();
  const url = SITE_URL + asPath.split(/[?#]/)[0];

  return (
    <MotionConfig reducedMotion="user">
      <style jsx global>{`
        :root {
          --font-poppins: ${poppins.style.fontFamily};
        }
      `}</style>
      <VisitLogger />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://res.cloudinary.com/dtl48kr1u/image/upload/v1694445159/personal-site/j_nx7enz.png"
          sizes="any"
        />
        <title>{SITE_TITLE}</title>
        <meta name="description" content={SITE_DESCRIPTION} key="description" />
        <link rel="canonical" href={url} key="canonical" />
        <meta property="og:type" content="website" key="og:type" />
        <meta property="og:site_name" content={SITE_NAME} key="og:site_name" />
        <meta property="og:title" content={SITE_TITLE} key="og:title" />
        <meta property="og:description" content={SITE_DESCRIPTION} key="og:description" />
        <meta property="og:url" content={url} key="og:url" />
        <meta property="og:image" content={SITE_IMAGE} key="og:image" />
        <meta property="og:image:width" content="1200" key="og:image:width" />
        <meta property="og:image:height" content="630" key="og:image:height" />
        <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
      </Head>
      <StarBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Component {...pageProps} />
      </div>
    </MotionConfig>
  );
}
