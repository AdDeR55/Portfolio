/**
 * ─────────────────────────────────────────────────────────────
 *  CENTRAL CONFIG — edit this file to update the whole portfolio.
 *  Anything set to `null` is rendered as "classified / pending"
 *  and no dead link is shown. Nothing here is invented: every
 *  fact comes from the resume or from details supplied by Meet.
 * ─────────────────────────────────────────────────────────────
 */

export const site = {
  name: "Meet Jaiswal",
  url: "https://meetjaiswal.dev", // TODO: replace with your deployed URL
  title: "Front-End Engineer | Full-Stack Developer | AI Enthusiast",
  tagline:
    "Somewhere Between Ideas and Reality, I Build Things.",
  subtitle: "Developer by Day. Problem Solver Beyond Reality.",
  description:
    "I'm a Computer Science Engineering student and developer passionate about building scalable web applications, AI-powered products, and interactive digital experiences.",
  roles: ["Frontend Engineer", "Full Stack Developer", "AI Enthusiast", "Creative Problem Solver"],
} as const;

export const links = {
  email: "meetjaiswal920@gmail.com",
  github: "https://github.com/AdDeR55",
  githubUser: "AdDeR55",
  linkedin: "https://linkedin.com/in/meet-jaiswal",
  resume: "/Meet_Jaiswal_Resume.pdf", // file lives in /public
  phone: "+91-9329909855",
  /**
   * Optional: paste a Formspree / Getform endpoint (https://formspree.io/f/xxxx)
   * to make the contact form POST directly. If null, the form opens the
   * visitor's mail client with the message pre-filled (always works).
   */
  formEndpoint: null as string | null,
};

export type Level = 4 | 5;

export interface Project {
  id: string;
  name: string;
  level: Level; // classification level
  kind: "saas" | "agent" | "resume" | "canvas" | "terminal";
  summary: string;
  tech: string[];
  features: string[];
  repo: string | null; // GitHub URL, or null if private / not yet public
  live: string | null; // Deployment URL, or null if none
  image?: string; // optional screenshot in /public, e.g. "/projects/vergo.png"
  note?: string; // shown in the project details (e.g. why a link is unavailable)
  date?: string;
}

export const projects: Project[] = [
  {
    id: "vergo-ai",
    name: "VERGO AI",
    level: 5,
    kind: "saas",
    date: "March 2026",
    summary:
      "A multi-tool AI SaaS platform built with React, Vite, JavaScript, and Tailwind CSS.",
    tech: ["React", "Vite", "JavaScript", "Tailwind CSS", "Clerk"],
    features: [
      "Text generation, image creation, resume analysis, and AI-powered editing workflows",
      "Clerk authentication and subscription management for premium features",
      "Modular React components with optimized API interactions",
      "Responsive UI with reusable components and light/dark theme",
    ],
    repo: "https://github.com/AdDeR55/Vergo-AI",
    live: "https://vergo-ai-frontend.onrender.com",
  },
  {
    id: "codexa",
    name: "CODEXA",
    level: 5,
    kind: "agent",
    date: "August 2026",
    summary:
      "An AI-powered coding agent that generates code, executes development tasks, and iteratively debugs its own solutions inside isolated sandboxes.",
    tech: ["React.js", "TypeScript", "Node.js", "Docker", "WebSocket", "AI APIs", "REST APIs", "Tailwind CSS"],
    features: [
      "Isolated Docker sandbox environments for secure code execution",
      "Real-time terminal execution with WebSocket streaming and live agent interaction",
      "Git/GitHub workflows: repository cloning, branch-based development, code modification",
      "Persistent project workspaces",
      "Responsive UI with reusable components and light/dark theme",
    ],
    repo: "https://github.com/AdDeR55/CODEXA",
    live: null,
  },
  {
    id: "knowyou",
    name: "KNOWYOU",
    level: 4,
    kind: "resume",
    date: "January 2026",
    summary:
      "An AI-powered resume analyzer built using Python, OpenAI API, LangChain, and FAISS.",
    tech: ["Python", "OpenAI API", "LangChain", "FAISS"],
    features: [
      "Resume summarization, skill analysis, and strength/weakness evaluation",
      "Keyword-based job matching with personalized job recommendations",
      "Integrates job data with resume information",
      "LinkedIn job scraper that extracts and filters postings from dynamic pages",
    ],
    repo: "https://github.com/AdDeR55/KnowYou",
    live: null,
  },
  {
    id: "algointerview",
    name: "ALGOINTERVIEW AI",
    level: 5,
    kind: "canvas",
    date: "June – July 2026",
    summary:
      "An AI-powered mock interview platform with interactive system-design interview interfaces, AI avatar integration, and real-time voice via WebRTC.",
    tech: ["React", "TypeScript", "React Flow", "HeyGen", "WebRTC", "Node.js", "PostgreSQL", "Prisma"],
    features: [
      "Interactive system-design canvas where candidates build architecture diagrams (React Flow)",
      "Canvas snapshot and JSON export that turns designs into structured data for backend and AI processing",
      "AI avatar and voice interaction for real-time interviewer responses (HeyGen + WebRTC)",
      "Backend APIs, authentication, evaluation logic, and report generation",
    ],
    repo: "https://github.com/Hardik-N/ALgo-mock-interviewer",
    live: null, // TODO: add public product URL if you want to link it
    note: "Built during my Platform Engineer internship at AlgoUniversity.",
  },
  {
    id: "campus-it-lab",
    name: "CAMPUS IT SERVICE DESK HANDOVER LAB",
    level: 4,
    kind: "terminal",
    summary:
      "A hands-on terminal lab designed to teach command-line tools through a realistic campus IT help desk scenario.",
    tech: ["Command Line"], // TODO: list the exact tools used
    features: [
      "Hands-on terminal exercises for learning command-line tools",
      "Realistic campus IT help desk scenario",
    ],
    repo: "https://github.com/AdDeR55/TA-Tech-Lab-2-Assignment",
    live: null,
  },
];

export interface Experience {
  id: string;
  label: string;
  role: string;
  org: string;
  orgNote?: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
  /** Add more verified achievements here; they render automatically. */
  achievements: string[];
}

export const experience: Experience[] = [
  {
    id: "algouniversity",
    label: "ROLE 01",
    role: "Platform Engineer Intern",
    org: "AlgoUniversity",
    orgNote: "Y Combinator",
    period: "June 2026 – July 2026",
    location: "Remote",
    summary:
      "Developed features for an AI-powered mock interview platform used by real users across frontend, backend, authentication, and interview workflows.",
    highlights: [
      "Built interactive system-design interview interfaces using React, TypeScript, and React Flow, enabling candidates to create structured architecture diagrams.",
      "Implemented canvas snapshot and JSON export to convert visual system designs into structured data for backend and AI processing.",
      "Integrated AI avatar and voice-interaction capabilities using HeyGen and WebRTC for real-time interviewer responses.",
      "Developed backend APIs, database workflows, authentication, evaluation logic, and report generation with Node.js, PostgreSQL, Prisma, and REST APIs.",
      "Used Git and GitHub for feature branches, pull requests, rebasing, merge conflict resolution, and collaborative development.",
    ],
    stack: ["React", "TypeScript", "React Flow", "WebRTC", "HeyGen", "Node.js", "PostgreSQL", "Prisma"],
    achievements: [],
  },
  {
    id: "edunet",
    label: "ROLE 02",
    role: "Full Stack Web Developer Intern",
    org: "Edunet Foundation",
    period: "July 2025 – August 2025",
    location: "Remote",
    summary:
      "Built responsive web interfaces and backend functionality, shipping a full-stack e-commerce application.",
    highlights: [
      "Developed responsive web interfaces using HTML, CSS, and JavaScript with cross-device compatibility.",
      "Implemented backend functionality using Node.js, PHP, and MySQL, including authentication and database operations.",
      "Built SwiftCart, a full-stack e-commerce app with product listings, cart management, authentication, and database integration.",
      "Used Git and GitHub for version control, feature development, and branch management.",
    ],
    stack: ["HTML", "CSS", "JavaScript", "Node.js", "PHP", "MySQL"],
    achievements: [],
  },
];

export interface Experiment {
  id: string;
  code: string;
  name: string;
  skills: string[];
}

/** Skills as lab experiments. Deliberately no percentages or proficiency levels. */
export const experiments: Experiment[] = [
  { id: "frontend", code: "SKILL AREA 01", name: "Frontend Engineering", skills: ["React", "Next.js", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS"] },
  { id: "backend", code: "SKILL AREA 02", name: "Backend Systems", skills: ["Node.js", "Express.js", "FastAPI", "REST APIs"] },
  { id: "database", code: "SKILL AREA 03", name: "Database Technologies", skills: ["PostgreSQL", "MongoDB", "MySQL", "Prisma"] },
  { id: "ai", code: "SKILL AREA 04", name: "Artificial Intelligence", skills: ["OpenAI APIs", "LangChain", "FAISS", "AI Integrations"] },
  { id: "eng", code: "SKILL AREA 05", name: "Engineering & Problem Solving", skills: ["C", "C++", "Python", "DSA", "Git", "GitHub", "WebRTC"] },
];
export const profile = {
  rows: [
    ["Name", "Meet Jaiswal"],
    ["University", "SRM University-AP"],
    ["Designation", "Software Developer"],
    ["Specialization", "Frontend Engineering, Full Stack Development, AI"],
    ["Currently", "Building impactful software products."],
    ["Principle", "Learn, Build, Improve, Repeat."],
  ] as [string, string][],
};
export const education = {
  school: "SRM University-AP",
  place: "Vijayawada",
  degree: "B.Tech in Computer Science Engineering",
  graduation: "2027",
  cgpa: "8.38 / 10",
};

export interface Certification {
  name: string;
  issuer: string;
  detail: string;
  url: string | null; // TODO: paste certificate links
}

export const certifications: Certification[] = [
  {
    name: "Oracle Java SE 17 Developer Certification",
    issuer: "Oracle",
    detail:
      "Java programming, object-oriented programming, exception handling, collections, streams, and modern Java features.",
    url: null,
  },
  {
    name: "C++: Data Structures and Algorithms Specialization",
    issuer: "Codio",
    detail: "Data structures, algorithms, problem solving, and implementation using C++.",
    url: null,
  },
  {
    name: "Oracle Data Science Certificate",
    issuer: "Race to Learn (2025)",
    detail: "Machine learning workflows, data preparation, model building, and cloud-based tools.",
    url: null,
  },
  {
    name: "AWS Cloud Fundamentals",
    issuer: "Coursera",
    detail:
      "AWS cloud services, IAM, EC2, S3, Lambda, DynamoDB, CloudWatch, cloud security, scalability, and serverless architecture.",
    url: null,
  },
];

/** Page sections: order = page order. `nav: false` keeps a section out of the alphabet-wall nav. */
export const sections = [
  { id: "home", label: "HOME", nav: true },
  { id: "about", label: "ABOUT", nav: true },
  { id: "skills", label: "SKILLS", nav: true },
  { id: "projects", label: "PROJECTS", nav: true },
  { id: "experience", label: "EXPERIENCE", nav: true },
  { id: "github", label: "GITHUB", nav: true },
  { id: "education", label: "EDUCATION", nav: false },
  { id: "contact", label: "CONTACT", nav: true },
] as const;

export type SectionId = (typeof sections)[number]["id"];