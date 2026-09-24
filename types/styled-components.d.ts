import type { darkTheme } from "@/styles/ThemeConfig";

type Theme = typeof darkTheme;

declare module "styled-components" {
  export interface DefaultTheme extends Theme {}
}
