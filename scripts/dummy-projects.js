/**
 * Dummy project data for design work.
 * Placeholder images from picsum.photos (different seed per project for variety).
 */

const PLACEHOLDER = (w, h, seed) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

module.exports = [
  // ---- Web Development ----
  {
    internal_id: 1,
    name: "Portfolio Site",
    alt: "Portfolio site desktop mockup",
    stack: "Next.js, TypeScript, Tailwind",
    stack_list: ["Next.js", "Typescript", "React", "CSS"],
    description:
      "A minimal portfolio built with Next.js and TypeScript. Features dark mode, responsive layout, and a project showcase with filtering by category.",
    composition: ["Next.js App Router", "Styled components", "MongoDB for content"],
    features: ["Dark/light theme", "Responsive design", "Project filtering", "Contact form"],
    mockup_desktop: PLACEHOLDER(800, 500, "portfolio1"),
    mockup_mobile: PLACEHOLDER(400, 700, "portfolio1m"),
    link: "https://vercel.com",
    repository: "https://github.com",
    category: "web-development",
  },
  {
    internal_id: 2,
    name: "E-commerce Dashboard",
    alt: "E-commerce admin dashboard",
    stack: "React, Node.js, MongoDB",
    stack_list: ["React", "Node.js", "MongoDB", "Firebase"],
    description:
      "Admin dashboard for a small e-commerce store. Manage products, orders, and customers with a clean React UI and Node.js API.",
    composition: ["React SPA", "REST API", "MongoDB", "Firebase Auth"],
    features: ["Product CRUD", "Order management", "Basic analytics", "User roles"],
    mockup_desktop: PLACEHOLDER(800, 500, "ecom2"),
    mockup_mobile: PLACEHOLDER(400, 700, "ecom2m"),
    link: "https://vercel.com",
    repository: "https://github.com",
    category: "web-development",
  },
  {
    internal_id: 3,
    name: "Blog Platform",
    alt: "Blog platform screenshot",
    stack: "Next.js, MDX, Cloudinary",
    stack_list: ["Next.js", "React", "Cloudinary", "HTML", "CSS"],
    description:
      "A blog with MDX support and image uploads via Cloudinary. Static generation with on-demand revalidation.",
    composition: ["Next.js SSG", "MDX", "Cloudinary", "RSS feed"],
    features: ["MDX posts", "Image upload", "Tags and search", "RSS"],
    mockup_desktop: PLACEHOLDER(800, 500, "blog3"),
    mockup_mobile: PLACEHOLDER(400, 700, "blog3m"),
    link: "https://vercel.com",
    repository: "https://github.com",
    category: "web-development",
  },
  // ---- Software Engineering ----
  {
    internal_id: 4,
    name: "CLI Tool",
    alt: "CLI tool terminal output",
    stack: "Node.js, TypeScript",
    stack_list: ["Node.js", "Typescript", "JavaScript"],
    description:
      "A command-line tool for automating local dev tasks. Built with Node.js and TypeScript, published to npm.",
    composition: ["Node.js", "Commander.js", "TypeScript", "Jest"],
    features: ["Multiple commands", "Config file support", "Colored output", "Progress bars"],
    mockup_desktop: PLACEHOLDER(800, 500, "cli4"),
    mockup_mobile: PLACEHOLDER(400, 700, "cli4m"),
    link: "https://github.com",
    repository: "https://github.com",
    category: "software-engineering",
  },
  {
    internal_id: 5,
    name: "API Gateway",
    alt: "API gateway architecture",
    stack: "Node.js, Express, JWT",
    stack_list: ["Node.js", "JavaScript", "JWT", "MongoDB"],
    description:
      "Lightweight API gateway with authentication, rate limiting, and request logging. Used as a BFF for a mobile app.",
    composition: ["Express server", "JWT auth", "Rate limiter", "MongoDB for logs"],
    features: ["JWT auth", "Rate limiting", "Request logging", "Health checks"],
    mockup_desktop: PLACEHOLDER(800, 500, "api5"),
    mockup_mobile: PLACEHOLDER(400, 700, "api5m"),
    link: "https://github.com",
    repository: "https://github.com",
    category: "software-engineering",
  },
  {
    internal_id: 6,
    name: "Data Pipeline",
    alt: "Data pipeline diagram",
    stack: "Python, PostgreSQL",
    stack_list: ["JavaScript", "Node.js", "MongoDB"],
    description:
      "ETL pipeline that fetches data from external APIs, transforms it, and loads into a data store. Runs on a schedule.",
    composition: ["Scheduled jobs", "API clients", "Transform layer", "PostgreSQL"],
    features: ["Incremental sync", "Error retry", "Basic monitoring", "Config-driven"],
    mockup_desktop: PLACEHOLDER(800, 500, "pipe6"),
    mockup_mobile: PLACEHOLDER(400, 700, "pipe6m"),
    link: "https://github.com",
    repository: "https://github.com",
    category: "software-engineering",
  },
  // ---- 42Berlin ----
  {
    internal_id: 7,
    name: "libft",
    alt: "libft project",
    stack: "C",
    stack_list: ["HTML", "CSS", "JavaScript"],
    description:
      "42 project: recoding a set of standard C library functions. Focus on memory management, strings, and linked lists.",
    composition: ["C standard functions", "Makefile", "Bonus: linked list helpers"],
    features: ["ft_strlen, ft_strdup, etc.", "Bonus functions", "Makefile with rules"],
    mockup_desktop: PLACEHOLDER(800, 500, "libft7"),
    mockup_mobile: PLACEHOLDER(400, 700, "libft7m"),
    link: "https://github.com",
    repository: "https://github.com",
    category: "42berlin",
  },
  {
    internal_id: 8,
    name: "get_next_line",
    alt: "get_next_line project",
    stack: "C",
    stack_list: ["React", "Node.js"],
    description:
      "42 project: reading a file line by line with a given file descriptor. Managing static buffers and edge cases.",
    composition: ["Single function", "Static buffer", "Multiple fd support (bonus)"],
    features: ["Line-by-line read", "Any buffer size", "Multiple fd (bonus)"],
    mockup_desktop: PLACEHOLDER(800, 500, "gnl8"),
    mockup_mobile: PLACEHOLDER(400, 700, "gnl8m"),
    link: "https://github.com",
    repository: "https://github.com",
    category: "42berlin",
  },
  {
    internal_id: 9,
    name: "minishell",
    alt: "minishell terminal",
    stack: "C",
    stack_list: ["Next.js", "Typescript", "React"],
    description:
      "42 project: a minimal Unix shell. Parsing commands, pipes, redirections, and executing with execve.",
    composition: ["Lexer/parser", "Builtins (cd, echo, export)", "Pipes and redirections", "Signals"],
    features: ["Pipes", "Redirections", "Builtins", "Signal handling"],
    mockup_desktop: PLACEHOLDER(800, 500, "shell9"),
    mockup_mobile: PLACEHOLDER(400, 700, "shell9m"),
    link: "https://github.com",
    repository: "https://github.com",
    category: "42berlin",
  },
];
