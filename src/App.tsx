import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  profile,
  navigation,
  projects,
  heroStats,
  skills,
  education,
  certifications,
} from "./data";
import { Count, Reveal } from "./motion";
import {
  Icon,
  CursorGlow,
  External,
  Button,
  SectionHeading,
} from "./components/ui";
import { ProjectMini, ProjectStory } from "./components/projects";
import { CommandPalette } from "./components/CommandPalette";
import { Workbench } from "./components/Workbench";
import { CricketToy } from "./components/toys/CricketToy";
import { MarblePipeline } from "./components/toys/MarblePipeline";
import { CopyEmail } from "./components/CopyEmail";
import { scrollToSection } from "./lib/scroll-to-section";
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  useEffect(() => {
    const initialHash = location.hash;
    if (!initialHash) return;
    const initialId = decodeURIComponent(initialHash.slice(1));
    if (navigation.some((item) => item.id === initialId))
      setActiveSection(initialId);
    let cancelled = false;
    document.fonts.ready.then(() => {
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled || location.hash !== initialHash) return;
          scrollToSection(initialId, "auto");
        }),
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const ids = [
      "home",
      "overview",
      "projects",
      "skills",
      "journey",
      "about",
      "contact",
    ];
    let positions: { id: string; top: number }[] = [];
    let offset = 0;
    let disposed = false;
    const update = (scrollTop: number) => {
      const current = positions
        .filter((section) => section.top <= scrollTop + offset)
        .at(-1);
      setActiveSection(current?.id || "");
    };
    const measure = () => {
      if (disposed) return;
      offset =
        (document.querySelector<HTMLElement>(".site-header")?.offsetHeight ||
          90) + 32;
      document.documentElement.style.setProperty(
        "--anchor-offset",
        `${offset}px`,
      );
      positions = ids.flatMap((id) => {
        const element = document.getElementById(id);
        return element
          ? [{ id, top: element.getBoundingClientRect().top + window.scrollY }]
          : [];
      });
      update(window.scrollY);
    };
    const observer = new ResizeObserver(measure);
    const main = document.getElementById("main");
    if (main) observer.observe(main);
    window.addEventListener("resize", measure);
    document.fonts.ready.then(measure);
    measure();
    const unsubscribe = scrollYProgress.on("change", () =>
      update(window.scrollY),
    );
    return () => {
      disposed = true;
      unsubscribe();
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [scrollYProgress]);
  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!link) return;
      const id = decodeURIComponent(link.hash.slice(1));
      if (!id || id === "main" || !document.getElementById(id)) return;

      event.preventDefault();
      if (location.hash !== `#${id}`)
        history.pushState(null, "", `#${id}`);
      if (navigation.some((item) => item.id === id)) setActiveSection(id);
      const behavior = matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";
      requestAnimationFrame(() => scrollToSection(id, behavior));
    };
    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!(event.target as Element).closest(".site-header"))
        setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 1000) setMenuOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 1000);
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen((v) => !v);
        setMenuOpen(false);
      }
      if (e.key === "Escape") {
        if (document.activeElement?.closest("#mobile-menu"))
          document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
        setMenuOpen(false);
        setIntroDone(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handler);
    };
  }, []);
  useEffect(() => {
    document.body.style.overflow = commandOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [commandOpen]);
  return (
    <>
      <CursorGlow />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <motion.div
        className="reading-progress"
        style={{ scaleX: reduced ? scrollYProgress : progress }}
        aria-hidden="true"
      />
      <header className="site-header">
        <div className="nav-shell">
          <a
            href="#home"
            className="brand"
            aria-label="Sai Prakash Lingala, home"
          >
            <svg
              className="brand-logo"
              viewBox="0 0 40 40"
              aria-hidden="true"
            >
              <path
                d="M39 2 16 6C8 7 4 12 4 16c0 3 4 5 10 7l11 4 5 2-4 3-8-3c-6-2-9-1-13 4L1 39l22-4c9-1 14-6 14-10 0-4-4-6-10-9l-10-4 4-4 14-2Z"
                fill="var(--accent)"
              />
            </svg>
            <span className="brand-text">
              <span>
                Sai Prakash<span className="brand-surname"> Lingala</span>
              </span>
              <small>Data engineering portfolio</small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation
              .filter((n) => n.id !== "contact")
              .map((n) => (
                <a
                  href={`#${n.id}`}
                  key={n.id}
                  aria-current={
                    activeSection === n.id ? "location" : undefined
                  }
                >
                  <span className="nav-link-label">{n.label}</span>
                </a>
              ))}
          </nav>
          <div className="nav-actions">
            <button
              className="search-trigger"
              onClick={() => {
                setMenuOpen(false);
                setCommandOpen(true);
              }}
              aria-label="Search portfolio"
              title="Search portfolio"
              aria-haspopup="dialog"
              aria-expanded={commandOpen}
            >
              <Icon name="search" size={20} />
            </button>
            <a className="contact-nav-cta" href="#contact">
              <span>Contact</span>
              <span className="contact-nav-arrow"><Icon size={14} /></span>
            </a>
            <button
              className={`menu-toggle icon-button ${menuOpen ? "is-open" : ""}`}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
        {menuOpen && (
          <motion.nav
            id="mobile-menu"
            className="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            {navigation.map((n, i) => (
              <a
                href={`#${n.id}`}
                key={n.id}
                aria-current={activeSection === n.id ? "location" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                <span className="mono">0{i + 1}</span>
                {n.label}
                <Icon />
              </a>
            ))}
            <button
              className="mobile-search-link"
              onClick={() => {
                setMenuOpen(false);
                setCommandOpen(true);
              }}
            >
              Search portfolio
              <Icon name="search" />
            </button>
            <a
              href={profile.resume}
              download
              onClick={() => setMenuOpen(false)}
            >
              Download resume
              <Icon name="download" />
            </a>
          </motion.nav>
        )}
      </header>
      <main id="main">
        <section id="home" className="hero container anchor-section">
          <div className="hero-grid">
            <div className="hero-copy">
              <motion.p
                className="intro-name"
                initial={{ opacity: reduced ? 1 : 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35 }}
              >
                Hello, I’m
              </motion.p>
              <h1>
                {profile.headline.map((line, i) => (
                  <span className="headline-line" key={line}>
                    <motion.span
                      initial={{ y: reduced ? 0 : "105%" }}
                      animate={{ y: 0 }}
                      transition={{
                        delay: introDone ? 0 : i * 0.13,
                        duration: introDone ? 0 : 0.65,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {i === profile.headline.length - 1 ? (
                        <em>{line}</em>
                      ) : (
                        line
                      )}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <p className="hero-role">{profile.roleLine}</p>
              <p className="hero-description">{profile.introduction}</p>
              <div className="hero-actions">
                <Button href="#projects">View projects</Button>
                <Button href={profile.resume} secondary download>
                  Download resume
                </Button>
                <a href="#contact" className="hero-contact">
                  Let’s talk <Icon size={14} />
                </a>
              </div>
              <div className="personal-links">
                <a href="#contact" className="availability-note">
                  {profile.availability}
                  <Icon name="right" size={15} />
                </a>
                <div>
                  <External href={profile.github}>
                    GitHub <Icon size={13} />
                  </External>
                  <External href={profile.linkedin}>
                    LinkedIn <Icon size={13} />
                  </External>
                </div>
              </div>
            </div>
            <motion.div
              className="hero-side"
              initial={{ opacity: 0, y: reduced ? 0 : 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Workbench />
            </motion.div>
          </div>
          <div className="hero-stats">
            {heroStats.map((s) => (
              <div className="stat" key={s.label}>
                <span className="mono stat-project">{s.project}</span>
                <strong>
                  <Count {...s} />
                </strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="hero-bottom">
            <span className="mono">
              VALIDATE CAREFULLY. BUILD REPRODUCIBLY.
            </span>
            <a href="#overview">
              Take a look around <span>↓</span>
            </a>
          </div>
          {!introDone && !reduced && (
            <button className="skip-intro" onClick={() => setIntroDone(true)}>
              Skip intro
            </button>
          )}
        </section>
        <section
          id="overview"
          className="container overview anchor-section"
          aria-label="Portfolio overview"
        >
          <div className="section-kicker">
            <span className="eyebrow">A LITTLE OF WHAT I DO</span>
            <span className="mono">
              BUILT WITH CURIOSITY. BACKED BY CHECKS.
            </span>
          </div>
          <div className="bento-grid">
            {projects.map((p) => (
              <Reveal className="bento-project" key={p.id}>
                <ProjectMini project={p} />
              </Reveal>
            ))}
            <Reveal className="bento-skills">
              <a href="#skills" className="card small-card">
                <div className="card-top">
                  <Icon name="code" />
                  <Icon size={17} />
                </div>
                <span className="eyebrow">THE TOOLKIT</span>
                <h3>
                  SQL. Python.
                  <br />
                  Pipeline thinking.
                </h3>
                <div className="skill-chips">
                  <span>Databricks</span>
                  <span>PySpark</span>
                  <span>Delta Lake</span>
                </div>
              </a>
            </Reveal>
            <Reveal className="bento-cert">
              <a href="#journey" className="card small-card">
                <div className="card-top">
                  <span className="credential-icon">✓</span>
                  <Icon size={17} />
                </div>
                <span className="eyebrow">CONTINUOUS LEARNING</span>
                <h3>
                  Foundations,
                  <br />
                  put into practice.
                </h3>
                <p>IBM Skills Network · Deloitte Forage</p>
                <span className="text-link">
                  2 completed credentials <Icon name="right" size={16} />
                </span>
              </a>
            </Reveal>
            <Reveal className="bento-links">
              <div className="card link-card">
                <External href={profile.github}>
                  <div>
                    <Icon name="code" />
                    <span>
                      Explore my GitHub<small>The work, in the open.</small>
                    </span>
                  </div>
                  <Icon />
                </External>
                <a href={profile.resume} download>
                  <div>
                    <Icon name="download" />
                    <span>
                      My resume<small>A little more context. PDF.</small>
                    </span>
                  </div>
                  <Icon />
                </a>
                <a href="#contact">
                  <div>
                    <Icon name="pin" />
                    <span>
                      Hyderabad, India
                      <small>
                        <i className="status-dot" /> Open to my first
                        opportunity.
                      </small>
                    </span>
                  </div>
                  <Icon />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
        <section
          id="projects"
          className="container projects-section anchor-section"
        >
          <Reveal>
            <SectionHeading
              index="01"
              label="SELECTED PROJECTS"
              title="Follow the data."
              description="Two projects. One consistent approach: validate carefully, build reproducibly, explain honestly."
            />
          </Reveal>
          {projects.map((p) => (
            <ProjectStory project={p} key={p.id} />
          ))}
        </section>
        <section id="skills" className="skills-section anchor-section">
          <div className="container">
            <Reveal>
              <SectionHeading
                index="02"
                label="SKILLS & TOOLS"
                title="A practical foundation."
                description="The tools I use—and the habits that make the work reliable."
              />
            </Reveal>
            <div className="skills-grid">
              {skills.map((s) => (
                <Reveal key={s.title}>
                  <div className="skill-group">
                    <span className="mono skill-number">{s.number}</span>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                    <ul>
                      {s.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    {s.note && <p className="skill-note">{s.note}</p>}
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <MarblePipeline />
            </Reveal>
          </div>
        </section>
        <section
          id="journey"
          className="container education-section anchor-section"
        >
          <Reveal>
            <SectionHeading
              index="03"
              label="EDUCATION & CREDENTIALS"
              title="Always a student."
            />
          </Reveal>
          <div className="education-layout">
            <div className="education-timeline">
              <h3 className="eyebrow education-column-title">Journey</h3>
              {education.map((e) => (
                <Reveal key={e.school}>
                  <div className="education-item">
                    <span className="timeline-dot" />
                    <span className="mono">{e.date}</span>
                    <h3>{e.school}</h3>
                    <p>{e.qualification}</p>
                    <span className="education-result">{e.result}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="certificates">
              <h3 className="eyebrow education-column-title">Credentials</h3>
              {certifications.map((c) => (
                <Reveal key={c.title}>
                  <div className="certificate card">
                    <div className="certificate-heading">
                      <span className="certificate-mark credential-wordmark">
                        {c.mark}
                      </span>
                      <span className="mono">{c.date}</span>
                    </div>
                    <span className="eyebrow">{c.issuer}</span>
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                    <div className="certificate-links">
                      <External href={c.url} className="text-link">
                        View certificate <Icon size={15} />
                      </External>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
        <section id="about" className="container about-section anchor-section">
          <Reveal>
            <div className="about-layout">
              <div className="about-aside">
                <span className="eyebrow">04 / BEHIND THE WORK</span>
                <h2>
                  Curious by nature.
                  <br />
                  <em>Careful by habit.</em>
                </h2>
                <CricketToy />
              </div>
              <div className="about-copy">
                <p className="about-lead">{profile.about}</p>
                <p>{profile.philosophy}</p>
                <p>{profile.cricket}</p>
                <div className="languages">
                  <span className="eyebrow">LANGUAGES</span>
                  <span>{profile.languages.join(" · ")}</span>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
        <section id="contact" className="contact-section anchor-section">
          <div className="container">
            <Reveal>
              <div className="contact-top">
                <span className="availability">
                  <i /> OPEN TO WORK
                </span>
                <span className="mono">05 / LET’S CONNECT</span>
              </div>
              <div className="contact-layout">
                <div>
                  <h2>
                    Good work starts
                    <br />
                    with a <em>conversation.</em>
                  </h2>
                  <p>
                    I’m looking for my first opportunity in data engineering.
                    <br />
                    Have a role, a question, or a project to discuss? Say hello.
                  </p>
                  <a className="email-link" href={`mailto:${profile.email}`}>
                    <span className="contact-email-address">
                      {profile.email}
                    </span>
                    <Icon />
                  </a>
                  <CopyEmail />
                </div>
                <div className="contact-links">
                  <a href={`tel:${profile.phoneHref}`}>
                    <span>Call</span>
                    <span className="contact-value">{profile.phone}</span>
                    <Icon size={17} />
                  </a>
                  <External href={profile.linkedin}>
                    <span>Connect</span>LinkedIn
                    <Icon size={17} />
                  </External>
                  <External href={profile.github}>
                    <span>Explore</span>GitHub
                    <Icon size={17} />
                  </External>
                  <a href={profile.resume} download>
                    <span>Download</span>Resume
                    <Icon name="download" size={17} />
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <footer className="container">
        <a href="#home" className="footer-name">
          Sai Prakash Lingala<span>Data engineering, thoughtfully.</span>
        </a>
        <span className="mono">
          © {new Date().getFullYear()} · HYDERABAD, INDIA
        </span>
        <a href="#home" className="back-top">
          Back to top ↑
        </a>
      </footer>
      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
      />
    </>
  );
}
