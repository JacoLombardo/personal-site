import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: "#FFF",
  text: "black",
  toggleBorder: "#FFF",
  background: "#363537",
};

export const darkTheme = {
  body: "black",
  text: "white",
  toggleBorder: "#6B8096",
  background: "#999",
};

export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.50s linear;
  }
`;
