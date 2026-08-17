import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Code2,
  ExternalLink,
  Github,
  Layers,
  Linkedin,
  Mail,
  Workflow,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";

// ───────────────────────────────────────────────────────────────────────────
// Contact details — replace with your real email and LinkedIn before deploying.
// ───────────────────────────────────────────────────────────────────────────
const CONTACT_EMAIL = "your.email@example.com";
const GITHUB_URL = "https://github.com/Aishasiddiqui97";
const LINKEDIN_URL = "https://www.linkedin.com/in/your-handle";
const REPO_URL =
  "https://github.com/Aishasiddiqui97/Buttons-with-a-Brain-Motion-State-Micro-interactions";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950";

const AREAS = [
  {
    icon: Code2,
    title: "Frontend Development",
    description:
      "Fast, accessible, responsive interfaces in React and Next.js — pixel-faithful on every screen, keyboard-friendly for every user.",
  },
  {
    icon: Layers,
    title: "Full-Stack Development",
    description:
      "End-to-end web apps: TypeScript, Node.js APIs, and clean component architecture — from database and API to deployed product.",
  },
  {
    icon: Bot,
    title: "AI / LLM Integration",
    description:
      "Streaming chat, intelligent features and prompt-driven UIs wired into real products — with loading, error and edge cases handled.",
  },
  {
    icon: Workflow,
    title: "AI Automation",
    description:
      "Python and Node workflows that use AI to remove repetitive work — from scripts that save hours to automation you can rely on.",
  },
];

const PROJECTS = [
  {
    title: "AI Chat Studio",
    tagline: "Streaming AI chat interface",
    description:
      "A production-quality chat UI that streams LLM tokens word-by-word, renders markdown replies and tool-result cards, and handles every pending, streaming and error state with full keyboard and screen-reader support. Verified by 38 unit tests at 100% coverage plus a Playwright E2E suite.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Streaming API"],
    demoHref: "/ai-chat-studio",
    accent: "from-violet-500 to-fuchsia-600",
  },
  {
    title: "BrainButton",
    tagline: "Motion micro-interaction component",
    description:
      "A reusable 'Generate AI' button with a six-state lifecycle — idle, hover, loading, success, error, disabled. Built with Framer Motion using compositor-only transforms, ARIA live announcements and full prefers-reduced-motion support.",
    tech: ["React", "TypeScript", "Framer Motion", "Accessibility"],
    demoHref: "/brain-button",
    accent: "from-amber-500 to-rose-500",
  },
  {
    title: "AI Fashion Studio 3D",
    tagline: "3D product customizer",
    description:
      "An immersive fashion e-commerce customizer built with React Three Fiber. Rotate a 3D bag, switch between fabric, silk and metallic materials, and change colors in real time — with a physically-based material system and a lazy-loaded WebGL canvas.",
    tech: ["Next.js", "React Three Fiber", "Three.js", "drei"],
    demoHref: "/fashion-studio",
    accent: "from-teal-400 to-emerald-600",
  },
];

const SKILL_GROUPS = [
  {
    title: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Responsive Web Development",
    ],
  },
  {
    title: "Full-Stack & APIs",
    skills: ["Node.js", "Python", "REST APIs", "Server Components", "Git / GitHub"],
  },
  {
    title: "AI & Automation",
    skills: [
      "AI / LLM Integration",
      "Streaming Chat UIs",
      "AI Automation Workflows",
      "Prompt Engineering",
    ],
  },
  {
    title: "Engineering Practice",
    skills: [
      "Testing (Vitest, RTL, Playwright)",
      "Accessibility (WCAG)",
      "CI/CD",
      "Performance",
    ],
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-950/40">
            <Code2 className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <p className="text-sm font-semibold tracking-wide text-slate-100">
            Aisha A. Siddiqui
          </p>
        </div>

        <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-3">
          <div className="hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white ${FOCUS_RING}`}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            href="#contact"
            className={`rounded-lg bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition-transform hover:-translate-y-0.5 sm:hidden ${FOCUS_RING}`}
          >
            Contact
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile (opens in a new tab)"
            className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white ${FOCUS_RING}`}
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="py-14 sm:py-20">
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-300">
          Frontend · Full-Stack · AI
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
          Hi, I&apos;m Aisha. I&apos;m a{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            Frontend &amp; Full-Stack Developer
          </span>{" "}
          building AI-powered web apps.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          I design and build fast, accessible, responsive web applications in
          React, Next.js and TypeScript — and I integrate AI features like
          streaming chat, automation and 3D product experiences that solve real
          problems for startups, agencies and small businesses.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Let%27s%20work%20together`}
            className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition-transform hover:-translate-y-0.5 ${FOCUS_RING}`}
          >
            Let&apos;s work together
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="#work"
            className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/10 ${FOCUS_RING}`}
          >
            View my work
          </a>
        </div>

        <ul
          aria-label="Primary technologies"
          className="mt-10 flex flex-wrap gap-2"
        >
          {[
            "React",
            "Next.js",
            "TypeScript",
            "JavaScript",
            "Tailwind CSS",
            "Node.js",
            "Python",
            "AI / LLM Integration",
            "AI Automation",
            "APIs",
            "Git / GitHub",
          ].map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      {/* What I do */}
      <section id="what-i-do" aria-label="What I do" className="scroll-mt-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          What I do
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
          Four strengths, one developer — so you always know who you&apos;re
          talking to.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {AREAS.map((area) => (
            <article
              key={area.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <area.icon
                className="h-6 w-6 text-violet-300"
                aria-hidden="true"
              />
              <h3 className="mt-4 text-base font-semibold text-slate-100">
                {area.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {area.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="work" aria-label="Projects" className="mt-16 scroll-mt-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Selected work
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
          Real builds you can try right now — every one has a live demo and
          public source.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <article
              key={project.title}
              className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-100">
                  {project.title}
                </h3>
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${project.accent}`}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                {project.tagline}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                {project.description}
              </p>
              <ul
                aria-label={`${project.title} technologies`}
                className="mt-4 flex flex-wrap gap-1.5"
              >
                {project.tech.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-xs text-slate-300"
                  >
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href={project.demoHref}
                  className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition-transform hover:-translate-y-0.5 ${FOCUS_RING}`}
                >
                  Live demo
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.05] px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 ${FOCUS_RING}`}
                >
                  Source
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" aria-label="Skills" className="mt-16 scroll-mt-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Skills &amp; tools
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SKILL_GROUPS.map((group) => (
            <article
              key={group.title}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-300">
                {group.title}
              </h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-300"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* About + Contact */}
      <section id="about" className="mt-16 scroll-mt-6">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          About me
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          I&apos;m a web developer focused on the frontend and the AI layer: I
          turn product ideas into working React and Next.js applications, and I
          make AI genuinely useful inside them — streaming replies, smart
          workflows and interactive 3D product experiences. I care about
          accessibility, performance and clean, testable code.
        </p>
      </section>

      <section
        id="contact"
        aria-label="Contact"
        className="mt-16 scroll-mt-6 rounded-3xl border border-violet-500/20 bg-gradient-to-b from-violet-950/40 to-transparent p-8 sm:p-12"
      >
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Let&apos;s work together
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          I&apos;m currently open to Frontend, Full-Stack and AI/Web Developer
          roles — including remote internships and junior positions. If you
          have a project, a role, or an idea, I&apos;d love to hear from you.
        </p>
        <div className="mt-6 max-w-lg mx-auto">
          <ContactForm />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Let%27s%20work%20together`}
            className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 ${FOCUS_RING}`}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            Or email me directly
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 ${FOCUS_RING}`}
          >
            <Github className="h-4 w-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 ${FOCUS_RING}`}
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
            LinkedIn
          </a>
        </div>
      </section>

      <footer className="mt-14 border-t border-white/10 pt-6 text-center text-xs text-slate-600">
        © 2026 Aisha A. Siddiqui · Built with Next.js, React &amp; Tailwind CSS
      </footer>
    </main>
  );
}
