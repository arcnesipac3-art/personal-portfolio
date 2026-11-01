// ─── PERSONAL INFORMATION ───────────────────────────────────
// All personal info is editable from this file.

export const personalInfo = {
  name: "Arc Aaron R. Capisen",
  monogram: "AC",
  role: "Student Developer",
  location: "Philippines",
  school: "Kiwalan National High School",
  email: "arcnesipac3@gmail.com",
  github: "https://github.com/arcnesipac3-art",
  linkedin: "",
  currentlyLearning: "Django REST Framework",
  tagline: "Curious by nature. Building through code.",
  footerTagline: "Student developer from the Philippines, building through code.",
} as const;

// ─── HERO SECTION ─────────────────────────────────────────────

export const heroContent = {
  label: "STUDENT DEVELOPER — PHILIPPINES",
  headline: "Curious by nature. Building through code.",
  description:
    "I'm a Senior High School STEM student interested in software development, web technologies, and problem-solving. I enjoy learning new ideas, building practical applications, and turning thoughtful ideas into working projects.",
  ctaPrimary: { label: "View My Work", href: "#projects" },
  ctaSecondary: { label: "Contact Me", href: "#contact" },
} as const;

// ─── ABOUT SECTION ────────────────────────────────────────────

export const aboutContent = {
  heading: "Curious. Always learning.",
  paragraphs: [
    "I'm a Senior High School STEM student at Kiwalan National High School. I enjoy building technology, solving problems, and exploring how software can improve everyday processes.",
    "I'm particularly interested in programming, software development, research, and creating practical digital solutions.",
  ],
  infoLabels: [
    { key: "Education", value: "Senior High School" },
    { key: "Strand", value: "STEM" },
    { key: "Location", value: "Philippines" },
    { key: "Focus", value: "Software Development" },
  ],
} as const;

// ─── SKILLS CAROUSEL ───────────────────────────────────────────

export interface SkillCategory {
  title: string;
  subtitle: string;
  skills: string[];
  icon: string;
}

export const skillsData: SkillCategory[] = [
  {
    title: "Frontend Development",
    subtitle: "Websites • UIs • Interfaces",
    icon: "Monitor",
    skills: ["HTML", "CSS", "JavaScript", "React", "TypeScript"],
  },
  {
    title: "Backend Development",
    subtitle: "APIs • Logic • Systems",
    icon: "Server",
    skills: ["Python", "Django", "REST APIs"],
  },
  {
    title: "Databases",
    subtitle: "Storage • Queries • Schema",
    icon: "Database",
    skills: ["PostgreSQL", "SQLite"],
  },
  {
    title: "Development Tools",
    subtitle: "Workflow • Version Control",
    icon: "Wrench",
    skills: ["Git", "GitHub", "VS Code"],
  },
  {
    title: "Other Interests",
    subtitle: "Design • Research • Strategy",
    icon: "Sparkles",
    skills: ["UI/UX Design", "Responsive Web Design", "Research", "Problem-solving"],
  },
];

// ─── TECH STACK ───────────────────────────────────────────────

export interface StackGroup {
  label: string;
  comment: string;
  items: { name: string; description: string }[];
}

export const stackData: StackGroup[] = [
  {
    label: "Front-End",
    comment: "// client",
    items: [
      { name: "HTML", description: "Semantic markup & structure" },
      { name: "CSS", description: "Styling, layout, animations" },
      { name: "JavaScript", description: "Interactivity & logic" },
      { name: "TypeScript", description: "Type-safe development" },
      { name: "React", description: "Component-based UIs" },
    ],
  },
  {
    label: "Back-End",
    comment: "// server",
    items: [
      { name: "Python", description: "Backend logic & scripting" },
      { name: "Django", description: "Web framework & ORM" },
      { name: "REST APIs", description: "Endpoint design & serialization" },
    ],
  },
  {
    label: "Workflow",
    comment: "// tools",
    items: [
      { name: "VS Code", description: "Primary code editor" },
      { name: "OpenCode", description: "Terminal-based AI coding agent" },
      { name: "Git", description: "Version control" },
      { name: "GitHub", description: "Collaboration & hosting" },
    ],
  },
];

// ─── PROJECTS SECTION ─────────────────────────────────────────

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface TrackCaseStudy {
  overview: string;
  problem: string;
  solution: string;
  features: ProjectFeature[];
  users: { role: string; description: string }[];
  technology: string[];
  devProcess: string;
  challenges: string;
  status: string;
}

export const trackProject = {
  name: "TRACK",
  expandedName: "Tracking Requirements and Attendance with Connected Knowledge",
  category: "School Requirements & Attendance Monitoring System",
  institution: "Kiwalan National High School, Iligan City, Philippines",
  description:
    "TRACK is a school requirements and attendance monitoring application designed to help students, teachers, and parents monitor school requirements, submissions, and attendance through a centralized platform.",
  problem:
    "School requirements and attendance information can be difficult to monitor when updates and records are distributed across different communication channels and manual processes.",
  techStack: ["React", "TypeScript", "Django", "Python"],
  databaseTech: "PostgreSQL",
  caseStudy: {
    overview:
      "TRACK is a school requirements and attendance monitoring application built for Kiwalan National High School. It serves administrators, teachers, students, and parents by centralizing requirement tracking and attendance information into a single accessible platform.",
    problem:
      "School requirements and attendance information can be difficult to monitor when updates and records are distributed across different communication channels and manual processes. TRACK aims to make requirement tracking and attendance information more organized and accessible.",
    solution:
      "TRACK organizes requirements and attendance information into a centralized digital platform. Students can track and submit requirements, teachers can encode attendance, and parents can monitor their child's attendance — all in one place with notification support.",
    features: [
      { title: "Student Requirements Tracking", description: "Track school requirements and monitor submission status in one place." },
      { title: "Requirement Submission Monitoring", description: "Monitor which requirements have been submitted, are pending, or are incomplete." },
      { title: "Incomplete Requirement Reminders", description: "Automated reminders for students with incomplete requirements." },
      { title: "Attendance Monitoring", description: "Track student attendance records over time with clear status indicators." },
      { title: "Teacher Attendance Encoding", description: "Teachers can quickly encode and update attendance for their classes." },
      { title: "Parent Access to Student Attendance", description: "Parents and guardians can view their child's attendance records." },
      { title: "Student & Parent Notifications", description: "In-app notifications keep students and parents informed of updates." },
      { title: "Web Push Notifications", description: "Push notifications deliver time-sensitive updates even outside the app." },
      { title: "Junior & Senior High School Support", description: "Designed to support both Junior High School and Senior High School levels." },
    ] as ProjectFeature[],
    users: [
      { role: "Administrators", description: "Manage users, oversee requirements and attendance across the institution." },
      { role: "Teachers", description: "Encode attendance, assign requirements, and monitor student submissions." },
      { role: "Students", description: "Track requirements, submit work, and view attendance records." },
      { role: "Parents & Guardians", description: "Monitor student attendance and receive notifications about updates." },
    ],
    technology: ["React", "TypeScript", "Django", "Python", "PostgreSQL"],
    devProcess:
      "TRACK uses a React + TypeScript frontend with a Django + Python backend API and a PostgreSQL database. The frontend communicates with the backend via REST APIs. The architecture separates concerns between requirement tracking, attendance monitoring, and notification delivery to keep the system modular and maintainable.",
    challenges:
      "Building a system that serves multiple user roles with different needs required careful planning of permissions, data flow, and interface design. // ← Edit this section with your own challenges and lessons learned.",
    status: "In Development",
  } as TrackCaseStudy,
};

// ─── EDUCATION / JOURNEY ──────────────────────────────────────

export interface EducationEntry {
  level: string;
  school: string;
  strand?: string;
  years: string;
}

export const educationData: EducationEntry[] = [
  {
    level: "Senior High School",
    school: "Kiwalan National High School",
    strand: "STEM",
    years: "2025 — 2027",
  },
  {
    level: "Junior High School",
    school: "Kiwalan National High School",
    years: "2021 — 2025",
  },
  {
    level: "Junior High School",
    school: "St. Therese Academy",
    years: "2020 — 2021",
  },
  {
    level: "Elementary",
    school: "St. Therese Academy",
    years: "2017 — 2020",
  },
  {
    level: "Elementary",
    school: "Tomas Cabili Central School",
    years: "2015 — 2017",
  },
];

// ─── ACHIEVEMENTS SECTION ──────────────────────────────────────

export interface AchievementEntry {
  title: string;
  category: string;
  description: string;
  year: string;
}

export const achievementsData: AchievementEntry[] = [];

export const achievementCategories = [
  "Academic Honors",
  "Research Activities",
  "Science Quiz Competitions",
  "Chess Competitions",
  "Campus Journalism",
  "Student Government",
  "Other School Activities",
];

// ─── CONTACT SECTION ──────────────────────────────────────────

export const contactContent = {
  heading: "Have an idea? Let's build.",
  description:
    "Whether it's a software idea, a creative project, or an opportunity to learn something new, I'm always interested in connecting with people who enjoy building things.",
} as const;

// ─── NAVIGATION ───────────────────────────────────────────────

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Stack", href: "#stack" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];
