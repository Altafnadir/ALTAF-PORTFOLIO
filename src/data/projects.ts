export interface Project {
  slug: string;
  title: string;
  problem: string;
  role: string;
  result: string;
  stack: string[];
  liveUrl?: string;
  githubUrl?: string;
  // Compatibility fields
  id?: string;
  tags?: string[];
}

export const projects: Project[] = [
  {
    slug: "school-management-portal",
    id: "school-management",
    title: "School Management Portal",
    problem: "Schools needed an intuitive, centralized portal for students, parents, and teachers to track attendance, grades, and schedules.",
    role: "Full-stack development, PostgreSQL database architecture, and responsive UI/UX.",
    result: "A high-performance portal with secure role-based access control, responsive dashboards, and grade reporting.",
    stack: ["React", "Next.js", "PostgreSQL", "Tailwind CSS"],
    tags: ["React", "Next.js", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "https://demo-school-portal.vercel.app",
    githubUrl: "https://github.com/altaf-dev/school-management-portal"
  },
  {
    slug: "scamshield-ai",
    id: "scamshield-ai",
    title: "ScamShield-AI",
    problem: "Users were increasingly falling victim to sophisticated phishing campaigns and financial fraud through SMS and emails.",
    role: "Frontend architecture, real-time risk visualization, and FastAPI machine learning integration.",
    result: "High-accuracy scam detection engine that parses suspicious text/links and delivers instant risk assessments.",
    stack: ["Next.js", "FastAPI", "Python", "AI / ML", "Tailwind CSS"],
    tags: ["Next.js", "FastAPI", "Python", "AI / ML", "Tailwind CSS"],
    liveUrl: "https://scamshield-ai.vercel.app",
    githubUrl: "https://github.com/altaf-dev/scamshield-ai"
  },
  {
    slug: "ai-interview-website",
    id: "ai-interview",
    title: "AI Interview Website",
    problem: "Job seekers and students lacked interactive, realistic interview practice with real-time speech feedback and scoring.",
    role: "Frontend development, Web Speech API integration, and interactive question analytics UI.",
    result: "Realistic mock interview interface with voice response recording, dynamic questions, and instant scorecards.",
    stack: ["React", "Tailwind CSS", "Speech API", "TypeScript"],
    tags: ["React", "Tailwind CSS", "Speech API", "TypeScript"],
    liveUrl: "https://ai-interview-prep.vercel.app",
    githubUrl: "https://github.com/altaf-dev/ai-interview-frontend"
  }
];

export default projects;
