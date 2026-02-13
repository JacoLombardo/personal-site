import { createGlobalStyle } from "styled-components";

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
  }
  body {
    background: radial-gradient(ellipse 120% 80% at 80% -20%, rgba(56, 189, 248, 0.06), transparent 50%),
                radial-gradient(ellipse 80% 60% at -10% 100%, rgba(167, 139, 250, 0.05), transparent 45%),
                #0a0a0b;
  }
`;
