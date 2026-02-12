import "bootstrap/dist/css/bootstrap.css";
import Head from "next/head";
import "../styles/global.css";
import { ThemeProvider } from "styled-components";
import { useState, useEffect } from "react";
import { GlobalStyles, darkTheme, lightTheme } from "@/styles/ThemeConfig";
import { Mode } from "@/types";
import StarBackground from "@/components/StarBackground";

export default function MyApp({ Component, pageProps }: any) {
  const [theme, setTheme] = useState<Mode>("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="https://res.cloudinary.com/dtl48kr1u/image/upload/v1694445159/personal-site/j_nx7enz.png"
          sizes="any"
        />
        <title>Jacopo Lombardo</title>
      </Head>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <GlobalStyles />
        <StarBackground theme={theme} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <Component {...pageProps} theme={theme} toggleTheme={toggleTheme} />
        </div>
      </ThemeProvider>
    </>
  );
}
