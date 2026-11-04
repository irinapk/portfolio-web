import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Rich } from "./Hero";
import { addTick, clamp, isMobile } from "../lib/ticker";

// Desktop: the section pins and the milestone track scrolls sideways. Mobile: a swipeable row.
export default function Journey() {
  const { t } = useTranslation();
  const items = t("journey.items", { returnObjects: true });
  const list = Array.isArray(items) ? items : [];
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const dotRef = useRef(null);
  const yearRef = useRef(null);
  const [pin, setPin] = useState(0);
  const [desktop, setDesktop] = useState(!isMobile());

  useLayoutEffect(() => {
    const measure = () => {
      const d = !isMobile();
      setDesktop(d);
      setPin(d && trackRef.current ? Math.max(0, trackRef.current.scrollWidth - window.innerWidth) : 0);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [list.length]);

  useEffect(() => {
    if (!desktop) {
      if (trackRef.current) trackRef.current.style.transform = "";
      return undefined;
    }
    return addTick(() => {
      const section = sectionRef.current;
      if (!section || !trackRef.current) return;
      const p = clamp(-section.getBoundingClientRect().top / Math.max(1, pin), 0, 1);
      trackRef.current.style.transform = `translateX(${-p * pin}px)`;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
      if (dotRef.current) dotRef.current.style.left = `calc(${p * 100}% - 5px)`;
      const idx = Math.min(list.length - 1, Math.round(p * (list.length - 1)));
      if (yearRef.current && list[idx] && yearRef.current.textContent !== list[idx].year) yearRef.current.textContent = list[idx].year;
    });
  }, [desktop, pin, list]);

  return (
    <section
      className="journey"
      id="journey"
      ref={sectionRef}
      data-pin={pin}
      style={desktop ? { height: `calc(100vh + ${pin}px)` } : undefined}
    >
      <div className="journey__sticky">
        <div className="journey__year" ref={yearRef} aria-hidden="true">
          {list[0]?.year}
        </div>
        <div className="journey__head wrap" data-reveal>
          <div className="stack-sm">
            <SectionLabel index="02" text={t("journey.label")} />
            <h2 className="h-big">
              <Rich k="journey.title" />
            </h2>
          </div>
          <p className="lede lede--narrow">{t("journey.lede")}</p>
        </div>
        <div className="journey__track" ref={trackRef}>
          {list.map((m, i) => (
            <article className={`milestone${i === list.length - 1 ? " milestone--now" : ""}`} key={m.year + i}>
              <div className="milestone__year">{m.year}</div>
              <div className="milestone__company mono">{m.company}</div>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </article>
          ))}
        </div>
        <div className="journey__rail" aria-hidden="true">
          <i ref={fillRef} />
          <b ref={dotRef} />
        </div>
      </div>
    </section>
  );
}

export function SectionLabel({ index, text }) {
  return (
    <div className="label mono">
      <span className="label__i">{index}</span>
      <span className="label__rule" />
      <span>{text}</span>
    </div>
  );
}
