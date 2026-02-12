"use client";

import { Mode, Project } from "@/types";
import ProjectsOrbital from "./ProjectsOrbital";

interface Props {
  projects: Project[];
  theme: Mode;
}

export default function Projects({ projects, theme }: Props) {
  return <ProjectsOrbital theme={theme} />;
}
