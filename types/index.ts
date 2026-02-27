export type ProjectCategory = "web-development" | "software-engineering" | "42berlin";

export interface Project {
  internal_id: number;
  /** Optional: slug id from projects.json (e.g. "get-a-recipe"). Used for /project/[id] URLs. */
  id?: string;
  name: string;
  alt: string;
  stack: string;
  stack_list: string[];
  description: string;
  composition: string[];
  features: string[];
  mockup_desktop: string;
  mockup_mobile: string;
  link: string;
  repository: string;
  /** Optional: groups project into Web Development, Software Engineering, or 42Berlin. Defaults to web-development. */
  category?: ProjectCategory;
  /** Optional: source type for list grouping (42, CODAC, etc.). Set when using projects.json. */
  projectType?: string;
  /** Optional: domain from projects.json (e.g. "web", "software"). */
  domain?: string;
}


export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  "web-development": "Web Development",
  "software-engineering": "Software Engineering",
  "42berlin": "42Berlin",
};

/** CV section content from content.cv (MongoDB) or projects.json */
export interface CvEntry {
  title: string;
  meta: string;
  bullets: string[];
}

export interface CvData {
  professionalExperience?: CvEntry[];
  education?: CvEntry[];
  languages?: string[];
}
