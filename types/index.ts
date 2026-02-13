export type ProjectCategory = "web-development" | "software-engineering" | "42berlin";

export interface Project {
  internal_id: number;
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
}


export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
  "web-development": "Web Development",
  "software-engineering": "Software Engineering",
  "42berlin": "42Berlin",
};
