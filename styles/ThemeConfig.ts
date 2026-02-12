import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: "#fafafa",
  text: "black",
  toggleBorder: "#FFF",
  background: "#363537",
};

export const darkTheme = {
  body: "#0a0a0b",
  text: "white",
  toggleBorder: "#6B8096",
  background: "#999",
};

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: background 0.4s ease, color 0.4s ease;
  }
  [data-theme="dark"] body {
    background: radial-gradient(ellipse 120% 80% at 80% -20%, rgba(56, 189, 248, 0.06), transparent 50%),
                radial-gradient(ellipse 80% 60% at -10% 100%, rgba(167, 139, 250, 0.05), transparent 45%),
                #0a0a0b;
  }
  [data-theme="light"] body {
    background: radial-gradient(ellipse 100% 70% at 90% 0%, rgba(2, 132, 199, 0.04), transparent 50%),
                #fafafa;
  }
`;
