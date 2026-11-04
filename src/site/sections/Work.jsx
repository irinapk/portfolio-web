import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Rich } from "./Hero";
import { SectionLabel } from "./Journey";
import { ArrowUpRight } from "../components/Icons";
import { FILTERS, PROJECTS, imgUrl } from "../data/projects";
import { addTick, clamp, lerp, prefersReducedMotion, smoothstep } from "../lib/ticker";

const FEATURED = PROJECTS.filter((p) => p.industrial).slice(0, 5);

/**
 * Exploded 3D stack of dashboard screenshots.
 * The layers themselves ignore the pointer (they move when lifted, which used to make hover flicker);
 * one fixed hit area maps pointer height to a layer instead.
 */
function FeaturedStack({ onOpen }) {
  const { t } = useTranslation();
  const [focus, setFocus] = useState(null);
  const areaRef = useRef(null);
  const layersRef = useRef(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    return addTick(() => {
      const area = areaRef.current;
      if (!area || !layersRef.current) return;
      const r = area.getBoundingClientRect();
      const p = clamp(1 - (r.top + r.height / 2) / window.innerHeight, 0, 1);
      const gap = reduce ? 40 : lerp(6, 64, smoothstep(clamp(p * 1.6 - 0.2, 0, 1)));
      layersRef.current.style.setProperty("--gap", `${gap}px`);
    });
  }, []);

  const pick = (e) => {
    const r = areaRef.current.getBoundingClientRect();
    const f = clamp((e.clientY - r.top) / r.height, 0, 0.999);
    setFocus(Math.floor(f * FEATURED.length));
  };
  const focused = focus == null ? null : FEATURED[focus];

  return (
    <div className="featured" data-reveal>
      <div className="featured__copy">
        <SectionLabel index={t("work.chapter")} text="TechDas · 2023 – 2024" />
        <h3 className="featured__title">
          <Rich k="work.featTitle" />
        </h3>
        <p className="lede lede--sm">{t("work.featText")}</p>
        <ol className="featured__list">
          {FEATURED.map((p, i) => (
            <li key={p.id}>
              <button
                className={focus === i ? "is-on" : ""}
                onMouseEnter={() => setFocus(i)}
                onMouseLeave={() => setFocus(null)}
                onFocus={() => setFocus(i)}
                onBlur={() => setFocus(null)}
                onClick={(e) => onOpen(PROJECTS.indexOf(p), e)}
              >
                <span className="featured__k">0{i + 1}</span>
                <span>{p.title}</span>
                <span className="featured__y">{p.year}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>
      <div
        className="exploded"
        ref={areaRef}
        onPointerMove={pick}
        onPointerLeave={() => setFocus(null)}
        onClick={(e) => onOpen(PROJECTS.indexOf(focused || FEATURED[0]), e)}
        role="presentation"
      >
        <div className={`exploded__layers${focus != null ? " has-focus" : ""}`} ref={layersRef}>
          {FEATURED.map((p, i) => (
            <div className={`exploded__layer${focus === i ? " is-lifted" : ""}`} style={{ "--i": FEATURED.length - 1 - i }} key={p.id}>
              <img src={imgUrl(p.cover)} alt={`${p.title} dashboard`} loading="lazy" />
            </div>
          ))}
        </div>
        <div className={`exploded__caption mono${focused ? " is-visible" : ""}`} aria-hidden="true">
          {focused ? focused.title : ""} <ArrowUpRight />
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onOpen }) {
  const coverRef = useRef(null);
  const move = (e) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion()) return;
    const el = coverRef.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg)`;
    el.style.setProperty("--gx", `${x * 100}%`);
    el.style.setProperty("--gy", `${y * 100}%`);
  };
  const leave = () => {
    if (coverRef.current) coverRef.current.style.transform = "";
  };
  return (
    <button className="card" data-flip={project.id} onPointerMove={move} onPointerLeave={leave} onClick={(e) => onOpen(index, e)}>
      <div className="card__cover" ref={coverRef}>
        <span className="card__idx">{String(index + 1).padStart(2, "0")}</span>
        <img src={imgUrl(project.cover)} alt="" loading="lazy" />
        <span className="card__glare" />
      </div>
      <div className="card__meta">
        <div>
          <h3>{project.title}</h3>
          {project.ko && !project.ko.startsWith("(") && <div className="card__ko">{project.ko}</div>}
        </div>
        <span className="mono muted card__when">
          {project.company} · {project.year}
        </span>
      </div>
      <div className="tags">
        {project.stack.slice(0, 4).map((s) => (
          <span className="tag" key={s}>
            {s}
          </span>
        ))}
      </div>
    </button>
  );
}

function ProjectGrid({ onOpen }) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState("All");
  const gridRef = useRef(null);
  const before = useRef(null);
  const visible = PROJECTS.filter((p) => filter === "All" || p.tags.includes(filter));

  const choose = (f) => {
    const rects = new Map();
    gridRef.current?.querySelectorAll("[data-flip]").forEach((el) => rects.set(el.dataset.flip, el.getBoundingClientRect()));
    before.current = rects;
    setFilter(f);
  };

  // FLIP: animate cards from their previous position, fade in new ones
  useLayoutEffect(() => {
    const rects = before.current;
    before.current = null;
    if (!rects || prefersReducedMotion() || !gridRef.current) return;
    gridRef.current.querySelectorAll("[data-flip]").forEach((el) => {
      const a = rects.get(el.dataset.flip);
      const b = el.getBoundingClientRect();
      const ease = "cubic-bezier(.2,.7,.1,1)";
      if (!a) el.animate([{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], { duration: 500, easing: ease });
      else if (a.left !== b.left || a.top !== b.top)
        el.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: "none" }], { duration: 650, easing: ease });
    });
  }, [filter]);

  return (
    <>
      <div className="work__toolbar">
        <div className="filters" role="toolbar" aria-label={t("work.filterLabel")}>
          {FILTERS.map((f) => (
            <button key={f} className={`filter${filter === f ? " is-on" : ""}`} aria-pressed={filter === f} onClick={() => choose(f)}>
              {f === "All" ? t("work.all") : f}
              <sup>{f === "All" ? PROJECTS.length : PROJECTS.filter((p) => p.tags.includes(f)).length}</sup>
            </button>
          ))}
        </div>
        <span className="mono muted">{t("work.count", { count: visible.length })}</span>
      </div>
      <div className="project-grid" ref={gridRef} data-reveal>
        {visible.map((p) => (
          <ProjectCard key={p.id} project={p} index={PROJECTS.indexOf(p)} onOpen={onOpen} />
        ))}
      </div>
    </>
  );
}

export default function Work({ onOpen }) {
  const { t } = useTranslation();
  return (
    <section className="work wrap" id="work">
      <div className="section-head" data-reveal>
        <div className="stack-sm">
          <SectionLabel index="03" text={t("work.label")} />
          <h2 className="h-big">
            <Rich k="work.title" />
          </h2>
        </div>
        <p className="lede lede--narrow">{t("work.lede")}</p>
      </div>
      <FeaturedStack onOpen={onOpen} />
      <ProjectGrid onOpen={onOpen} />
    </section>
  );
}
