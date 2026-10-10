import { Pipeline } from "./Pipeline";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  modelComparison,
  projectSnapshots,
  projectCardCopy,
  type Project,
} from "../data";
import { Reveal } from "../motion";
import { Icon, External } from "./ui";
function ProjectSnapshot({ project }: { project: Project }) {
  return (
    <div className="mini-visual">
      {project.id === "olist" ? (
        <div className="commerce-visual">
          <div className="visual-heading">
            <span className="mono">OLIST / BUSINESS SNAPSHOT</span>
            <span className="visual-badge">SQL → AI/BI</span>
          </div>
          <div className="commerce-value">
            {projectSnapshots.olist.revenue}
            <span>{projectSnapshots.olist.unit}</span>
          </div>
          <span className="visual-metric-label">
            Product revenue, explored from the source.
          </span>
          <div className="commerce-ledger">
            <div>
              <span>Orders</span>
              <strong>{projectSnapshots.olist.orders}</strong>
            </div>
            <div>
              <span>Items</span>
              <strong>{projectSnapshots.olist.items}</strong>
            </div>
            <div>
              <span>Visualizations</span>
              <strong>{projectSnapshots.olist.visualizations}</strong>
            </div>
          </div>
          <div className="commerce-foot">
            <span className="mono">KEYS · NULLS · DATES · PRICES</span>
            <Icon name="check" size={16} />
          </div>
        </div>
      ) : (
        <div className="churn-visual">
          <div className="visual-heading">
            <span className="mono">KKBOX / MODEL EVALUATION</span>
            <span className="visual-badge">LEAKAGE-SAFE</span>
          </div>
          <div className="churn-score">
            <strong>{modelComparison[1].value}</strong>
            <span>
              ROC-AUC
              <br />
              Random Forest
            </span>
          </div>
          <div className="churn-comparison">
            {modelComparison.map((model, i) => (
              <div key={model.name}>
                <span>{i === 0 ? "Logistic Regression" : "Random Forest"}</span>
                <div>
                  <i style={{ width: `${model.value * 100}%` }} />
                </div>
                <span>{model.value}</span>
              </div>
            ))}
          </div>
          <div className="churn-audit">
            <span>
              <Icon name="check" size={15} /> Temporal leakage audit
            </span>
            <strong>{projectSnapshots.kkbox.audit}</strong>
          </div>
        </div>
      )}
    </div>
  );
}
export function ProjectMini({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const toggle = useRef<HTMLButtonElement>(null);
  const panelId = `project-notes-${project.id}`;
  const copy = projectCardCopy[project.id === "olist" ? "olist" : "kkbox"];
  const transition = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 210, damping: 28 };
  return (
    <article
      className={`project-exhibit ${project.id} ${open ? "is-open" : ""}`}
      aria-labelledby={`project-card-title-${project.id}`}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          setOpen(false);
          toggle.current?.focus({ preventScroll: true });
        }
      }}
    >
      <div className="exhibit-masthead">
        <span className="exhibit-index mono">
          {project.number} <span>/ SELECTED WORK</span>
        </span>
        <External
          href={project.repo}
          className="exhibit-repo"
          aria-label={`View ${project.title} repository`}
        >
          <Icon name="code" size={18} />
          <span>Source</span>
          <Icon size={14} />
        </External>
      </div>
      <div className="exhibit-window">
        <div className="exhibit-paper-edge" aria-hidden="true" />
        <div className="exhibit-pages">
          <motion.div
            className="exhibit-proof"
            inert={open}
            aria-hidden={open}
            initial={false}
            animate={{
              opacity: open ? 0 : 1,
              y: reduced ? 0 : open ? -14 : 0,
              scale: reduced ? 1 : open ? 0.97 : 1,
            }}
            transition={transition}
          >
            <span className="exhibit-document-label mono">
              {copy.document} <span>↗</span>
            </span>
            <ProjectSnapshot project={project} />
            <span className="exhibit-disclosure">
              Project summary · figures from the repository
            </span>
          </motion.div>
          <motion.div
            id={panelId}
            className="exhibit-notes"
            inert={!open}
            aria-hidden={!open}
            initial={false}
            animate={{
              opacity: open ? 1 : 0,
              y: reduced ? 0 : open ? 0 : 18,
              scale: reduced ? 1 : open ? 1 : 0.98,
            }}
            transition={transition}
          >
            <span className="exhibit-document-label mono">
              BEHIND THE RESULT <Icon name="code" size={16} />
            </span>
            <h4>{copy.heading}</h4>
            <ol>
              {copy.steps.map((step, i) => (
                <li key={step}>
                  <span className="mono">0{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="exhibit-note">{copy.note}</p>
            <External
              href={`${project.repo}/blob/main/${project.dashboard}`}
              className="exhibit-dashboard"
            >
              View original dashboard <Icon size={14} />
            </External>
          </motion.div>
        </div>
        <div className="exhibit-viewbar">
          <span className="exhibit-page-indicator" aria-hidden="true">
            <i className={!open ? "selected" : ""} />
            <i className={open ? "selected" : ""} />
          </span>
          <button
            ref={toggle}
            className="exhibit-toggle"
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Back to results" : "Look inside"}
            <motion.span
              aria-hidden="true"
              animate={{ rotate: open ? 180 : 0 }}
              transition={transition}
            >
              <Icon name="right" size={16} />
            </motion.span>
          </button>
        </div>
      </div>
      <div className="exhibit-editorial">
        <span className="eyebrow">{project.category}</span>
        <h3 id={`project-card-title-${project.id}`}>{copy.title}</h3>
        <p>{project.description}</p>
        <div className="exhibit-stack">
          {copy.stack.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <a className="exhibit-cta" href={`#${project.id}`}>
          <span>Explore case study</span>
          <span className="exhibit-arrow">
            <Icon name="right" size={19} />
          </span>
        </a>
      </div>
    </article>
  );
}

function Dashboard({ project }: { project: Project }) {
  // The asset script creates this manifest only for original screenshots it downloaded successfully.
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/assets/dashboard-manifest.json")
      .then((r) => r.json())
      .then((data) => {
        if (active) setAvailable(Boolean(data[project.id]));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [project.id]);
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [8, -8]);
  return (
    <div ref={ref} className="dashboard-frame">
      <div className="dashboard-toolbar">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span className="mono">
          {project.id === "olist" ? "DATABRICKS AI/BI" : "POWER BI"} / DASHBOARD
        </span>
        <Icon name="database" size={17} />
      </div>
      {available ? (
        <a
          href={`/assets/${project.id}-dashboard.png`}
          target="_blank"
          rel="noopener noreferrer"
          className="dashboard-image-link"
        >
          <motion.img
            style={{ y: reduced ? 0 : y }}
            src={`/assets/${project.id}-dashboard.webp`}
            srcSet={`/assets/${project.id}-dashboard-small.webp 720w, /assets/${project.id}-dashboard.webp 1600w`}
            sizes="(max-width: 768px) 90vw, 1100px"
            onError={() => setAvailable(false)}
            loading="lazy"
            width="1600"
            height="1000"
            alt={project.dashboardAlt}
          />
        </a>
      ) : (
        <div className="dashboard-unavailable">
          <span className="dashboard-symbol">
            <Icon name="database" size={28} />
          </span>
          <h4>The dashboard, at the source.</h4>
          <p>{project.dashboardDescription}</p>
          <External
            href={`${project.repo}/blob/main/${project.dashboard}`}
            className="text-link"
          >
            View original on GitHub <Icon size={16} />
          </External>
          <span className="asset-note">
            Preview unavailable: the original image could not be fetched.
          </span>
        </div>
      )}
    </div>
  );
}
export function ProjectStory({ project }: { project: Project }) {
  return (
    <article id={project.id} className="project-story anchor-section">
      <Reveal>
        <div className="story-heading">
          <span className="project-number">{project.number}</span>
          <div>
            <span className="eyebrow">{project.category}</span>
            <h3>{project.title}</h3>
          </div>
          <External href={project.repo} className="repo-button">
            <Icon name="code" size={18} /> View repository <Icon size={15} />
          </External>
        </div>
        <div className="stack">
          {project.stack.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </Reveal>
      <div className="story-body">
        <div className="story-context">
          <Reveal>
            <span className="eyebrow">THE QUESTION</span>
            <p className="problem">{project.problem}</p>
            <div className="data-context">
              <span className="eyebrow">THE DATA</span>
              <p>{project.data}</p>
            </div>
            <div className="source-files">
              <span className="eyebrow">FOLLOW THE WORK</span>
              {project.files.map((f) => (
                <External
                  key={f.path}
                  href={`${project.repo}/${f.path.includes(".") ? "blob" : "tree"}/main/${f.path}`}
                >
                  <Icon name="code" size={15} />
                  {f.name}
                  <Icon size={12} />
                </External>
              ))}
            </div>
          </Reveal>
        </div>
        <div className="story-steps">
          {project.approach.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.04}>
              <div className="story-step">
                <span className="step-number mono">0{i + 1}</span>
                <div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal>
        <div className="pipeline-container">
          <div className="pipeline-caption">
            <span className="eyebrow">THE PIPELINE</span>
            <span className="mono">
              {project.id === "kkbox"
                ? "10 NOTEBOOKS · BATCH WORKFLOW"
                : "FROM SOURCE TO DOCUMENTATION"}
            </span>
          </div>
          <Pipeline stages={project.pipeline} />
        </div>
      </Reveal>
      <Reveal>
        <div className="results-grid">
          {project.metrics.map((m) => (
            <div key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </Reveal>
      <div className="insight-grid">
        <Reveal className="insight-copy">
          <span className="eyebrow">WHAT THE DATA SAYS</span>
          <h4>
            {project.id === "olist"
              ? "Delivery leaves an impression."
              : "Renewal behavior carries a signal."}
          </h4>
          <p>{project.insight}</p>
        </Reveal>
        <Reveal className="insight-chart">
          {project.id === "olist" ? (
            <>
              <span className="mono">AVERAGE DELIVERY / DAYS</span>
              <div className="bar-row">
                <span>1-star reviews</span>
                <div>
                  <i style={{ width: "85.2%" }} />
                </div>
                <strong>21.3</strong>
              </div>
              <div className="bar-row">
                <span>5-star reviews</span>
                <div>
                  <i style={{ width: "42.4%" }} />
                </div>
                <strong>10.6</strong>
              </div>
              <span className="chart-note">
                Observed association · shorter delivery, higher reviews
              </span>
            </>
          ) : (
            <>
              <span className="mono">MODEL COMPARISON / ROC-AUC</span>
              {modelComparison.map((m) => (
                <div className="model-row" key={m.name}>
                  <div>
                    <span>{m.name}</span>
                    <strong>{m.value}</strong>
                  </div>
                  <div className="model-bar">
                    <i style={{ width: `${m.value * 100}%` }} />
                  </div>
                </div>
              ))}
              <span className="chart-note">
                Random Forest selected · dataset churn rate 6.39%
              </span>
            </>
          )}
        </Reveal>
      </div>
      <Reveal>
        <aside className="honesty-note">
          <span className="note-symbol">i</span>
          <div>
            <strong>A note on interpretation</strong>
            <p>{project.caveat}</p>
          </div>
        </aside>
        <Dashboard project={project} />
      </Reveal>
    </article>
  );
}
