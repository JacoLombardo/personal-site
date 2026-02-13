"use client";

import { Project } from "@/types";
import ProjectsOrbital from "./ProjectsOrbital";

interface Props {
  projects: Project[];
}

export default function Projects({ projects }: Props) {
  return <ProjectsOrbital />;
}
