export type ProjectCategory = "web-development" | "software-engineering" | "42berlin";

export interface Project {
  internal_id: number;
  /** Slug id, used for /project/[id] URLs. */
  id?: string;
  name: string;
  stack: string;
  /** Groups the project into Web Development, Software Engineering, or 42Berlin. */
  category?: ProjectCategory;
  /** Source type for list grouping (42, CODAC, etc.). */
  projectType?: string;
}


export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  "web-development": "Web Development",
  "software-engineering": "Software Engineering",
  "42berlin": "42Berlin",
};

/** CV section content from content.cv (MongoDB) */
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
