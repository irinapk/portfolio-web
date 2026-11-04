import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChiliLogo, ArrowUpRight } from "./Icons";
import { SECTION_IDS } from "../data/content";
import { addTick, prefersReducedMotion } from "../lib/ticker";

/** Tracks which section is under the upper part of the viewport. */
function useActiveSection() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    let current = "hero";
    return addTick(() => {
      let next = SECTION_IDS[0];
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) next = id;
      }
      if (next !== current) {
        current = next;
        setActive(next);
      }
    });
  }, []);
  return active;
}

export function Loader() {
  const [state, setState] = useState(prefersReducedMotion() ? "gone" : "counting");
  const countRef = useRef(null);
  useEffect(() => {
    if (state !== "counting") return undefined;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const n = Math.min(100, Math.round((t - start) / 9));
      if (countRef.current) countRef.current.textContent = String(n).padStart(3, "0");
      if (n < 100) raf = requestAnimationFrame(tick);
      else {
        setState("leaving");
        setTimeout(() => setState("gone"), 1000);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);
  if (state === "gone") return null;
  return (
    <div className={`loader${state === "leaving" ? " is-done" : ""}`} aria-hidden="true">
      <div className="loader__inner">
        <ChiliLogo className="loader__logo" />
        <div className="loader__count" ref={countRef}>000</div>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  ["work", "nav.work"],
  ["journey", "nav.journey"],
  ["stack", "nav.stack"],
  ["offclock", "nav.off"],
  ["contact", "nav.contact"],
];

export function Nav() {
  const { t, i18n } = useTranslation();
  const active = useActiveSection();
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
  const isKo = i18n.language?.startsWith("ko");

  // hide on scroll down, show on scroll up
  useEffect(() => {
    let lastY = window.scrollY;
    return addTick(() => {
      const y = window.scrollY;
      const nav = navRef.current;
      if (!nav) return;
      if (y > lastY + 4 && y > 200) nav.classList.add("is-hidden");
      else if (y < lastY - 4) nav.classList.remove("is-hidden");
      lastY = y;
    });
  }, []);

  useLayoutEffect(() => {
    const place = () => {
      const link = menuRef.current?.querySelector(`a[href="#${active}"]`);
      if (!link) return setPill((p) => ({ ...p, visible: false }));
      const r = link.getBoundingClientRect();
      const m = menuRef.current.getBoundingClientRect();
      setPill({ left: r.left - m.left, width: r.width, visible: true });
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active, i18n.language]);

  const switchLanguage = () => {
    const next = isKo ? "en" : "ko";
    i18n.changeLanguage(next);
    document.documentElement.lang = next;
  };

  return (
    <nav className="nav" ref={navRef} aria-label="Main">
      <a className="nav__brand" href="#top" aria-label={t("nav.top")}>
        <ChiliLogo />
        Irina Park
      </a>
      <ul className="nav__menu" ref={menuRef}>
        {NAV_ITEMS.map(([id, key]) => (
          <li key={id}>
            <a href={`#${id}`} className={active === id ? "is-active" : ""}>
              {t(key)}
            </a>
          </li>
        ))}
        <li
          className="nav__pill"
          aria-hidden="true"
          style={{ left: pill.left, width: pill.width, opacity: pill.visible ? 1 : 0 }}
        />
      </ul>
      <div className="nav__actions">
        <button className="nav__lang" onClick={switchLanguage} aria-label={t("nav.lang")}>
          {isKo ? (
            <>
              EN / <b>KO</b>
            </>
          ) : (
            <>
              <b>EN</b> / KO
            </>
          )}
        </button>
        <a className="btn btn--primary btn--sm nav__cta" href="#contact">
          <span>{t("nav.talk")}</span>
          <ArrowUpRight />
        </a>
      </div>
    </nav>
  );
}

const CHAPTER_NUMBERS = { hero: "01", journey: "02", work: "03", stack: "04", offclock: "05", contact: "06" };

export function ScrollChrome() {
  const { t } = useTranslation();
  const active = useActiveSection();
  const barRef = useRef(null);
  useEffect(
    () =>
      addTick(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      }),
    [],
  );
  return (
    <>
      <div className="progress" ref={barRef} aria-hidden="true" />
      <div className="chapter mono" aria-hidden="true" key={active}>
        <span className="chapter__n">{CHAPTER_NUMBERS[active]}</span>
        <span className="chapter__bar" />
        <span>{t(`chapters.${active}`)}</span>
      </div>
    </>
  );
}
