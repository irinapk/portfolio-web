import { useEffect, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { ArrowUpRight } from "../components/Icons";
import { CV_URL, RIBBON_A, RIBBON_B } from "../data/content";
import { addTick, prefersReducedMotion } from "../lib/ticker";

export const Rich = ({ k }) => <Trans i18nKey={k} components={{ em: <span className="serif" />, br: <br /> }} />;

function SeoulClock() {
  const ref = useRef(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const update = () => {
      if (ref.current) ref.current.textContent = `Seoul · 37.56°N 126.97°E · ${fmt.format(new Date())} KST`;
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <div className="mono muted" ref={ref} />;
}

export function Hero() {
  const { t } = useTranslation();
  return (
    <section className="hero wrap" id="hero">
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__copy">
        <span className="chip">{t("hero.chip")}</span>
        <h1 className="hero__title">
          <Rich k="hero.title" />
        </h1>
        <p className="lede">{t("hero.lede")}</p>
        <div className="hero__ctas">
          <a className="btn btn--primary magnetic" href="#work">
            <span>{t("hero.cta1")}</span>
            <ArrowUpRight />
          </a>
          <a className="btn btn--ghost magnetic" href={CV_URL} download>
            <span>{t("hero.cta2")}</span>
            <ArrowUpRight color="#69D4E2" />
          </a>
        </div>
      </div>
      <div className="hero__bar">
        <div className="scroll-cue mono">
          <i />
          <span>{t("hero.scroll")}</span>
        </div>
        <div className="stats">
          {[
            ["5+", "hero.stat1"],
            ["16", "hero.stat2"],
            ["6", "hero.stat3"],
          ].map(([v, k]) => (
            <div className="stat" key={k}>
              <b>{v}</b>
              <span className="mono">{t(k)}</span>
            </div>
          ))}
        </div>
        <SeoulClock />
      </div>
    </section>
  );
}

export function Ribbons() {
  const tracks = useRef([]);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const state = [
      { x: 0, dir: 1 },
      { x: 0, dir: -1 },
    ];
    let prevY = window.scrollY;
    let velocity = 0;
    return addTick(() => {
      const y = window.scrollY;
      velocity += (y - prevY - velocity) * 0.12;
      prevY = y;
      state.forEach((s, i) => {
        const el = tracks.current[i];
        if (!el) return;
        s.x -= (0.6 + Math.min(Math.abs(velocity), 60) * 0.25) * s.dir;
        const half = el.scrollWidth / 2;
        if (s.dir > 0 && s.x < -half) s.x += half;
        if (s.dir < 0 && s.x > 0) s.x -= half;
        el.style.transform = `translateX(${s.x}px)`;
      });
    });
  }, []);
  return (
    <div className="ribbons" aria-hidden="true">
      {[RIBBON_A, RIBBON_B].map((words, i) => (
        <div className={`ribbon ribbon--${i ? "b" : "a"}`} key={i}>
          <div className="ribbon__track" ref={(el) => (tracks.current[i] = el)}>
            {[...words, ...words, ...words, ...words].map((w, j) => (
              <span key={j}>{w}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
