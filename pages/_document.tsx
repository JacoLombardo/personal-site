import { Html, Head, Main, NextScript } from "next/document";

// data-scroll-behavior keeps route changes jumping to the top instantly while
// global.css keeps smooth scrolling for in-page section links (Next 16 needs the opt-in).
export default function Document() {
  return (
    <Html lang="en" data-scroll-behavior="smooth">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
