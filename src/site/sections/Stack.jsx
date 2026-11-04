import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Rich } from "./Hero";
import { SectionLabel } from "./Journey";
import { RINGS } from "../data/content";
import { sceneStore } from "../lib/ticker";

export default function Stack() {
  const { t } = useTranslation();
  const names = t("stack.rings", { returnObjects: true });
  const [active, setActive] = useState(-1);
  const set = (i) => {
    setActive(i);
    sceneStore.highlightRing = i;
  };

  return (
    <section className="stack wrap" id="stack">
      <div className="stack__col" data-reveal>
        <SectionLabel index="04" text={t("stack.label")} />
        <h2 className="h-big">
          <Rich k="stack.title" />
        </h2>
        <p className="lede">{t("stack.lede")}</p>
        <div className="rings-list">
          {RINGS.map((items, i) => (
            <button
              key={i}
              className={`ring-row${active === i ? " is-on" : ""}`}
              aria-pressed={active === i}
              onMouseEnter={() => set(i)}
              onMouseLeave={() => set(-1)}
              onFocus={() => set(i)}
              onBlur={() => set(-1)}
              onClick={() => set(active === i ? -1 : i)}
            >
              <span className="ring-row__ring" style={{ opacity: 1 - i * 0.22 }} />
              <span>
                <h3>{Array.isArray(names) ? names[i] : ""}</h3>
                <p>{items.join(" · ")}</p>
              </span>
              <span className="ring-row__n mono">R{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
