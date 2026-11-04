import { useCallback, useEffect, useState } from "react";
import Background3D from "./components/Background3D";
import { Loader, Nav, ScrollChrome } from "./components/Chrome";
import ProjectModal from "./components/ProjectModal";
import { Hero, Ribbons } from "./sections/Hero";
import Journey from "./sections/Journey";
import Work from "./sections/Work";
import Stack from "./sections/Stack";
import OffClock from "./sections/OffClock";
import Contact from "./sections/Contact";
import { PROJECTS } from "./data/projects";
import { prefersReducedMotion } from "./lib/ticker";
import "./styles/site.scss";

/** Fade/slide in below-the-fold blocks. Anything already on screen (or without IntersectionObserver) stays visible. */
function useReveal() {
  useEffect(() => {
    if (prefersReducedMotion() || !("IntersectionObserver" in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add("reveal-pending");
        io.observe(el);
      }
    });
    return () => io.disconnect();
  }, []);
}

/** Buttons with .magnetic lean slightly toward the pointer. */
function useMagnetic() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const move = (e) => {
      const el = e.target.closest?.(".magnetic");
      document.querySelectorAll(".magnetic.is-pulled").forEach((b) => {
        if (b !== el) {
          b.classList.remove("is-pulled");
          b.style.transform = "";
        }
      });
      if (!el || e.pointerType !== "mouse") return;
      const r = el.getBoundingClientRect();
      el.classList.add("is-pulled");
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);
}

export default function Home() {
  const [modal, setModal] = useState({ open: false, index: 0, x: 0, y: 0 });
  useReveal();
  useMagnetic();

  const openProject = useCallback((index, e) => {
    const x = e?.clientX || window.innerWidth / 2;
    const y = e?.clientY || window.innerHeight / 2;
    setModal({ open: true, index, x, y });
  }, []);
  const close = useCallback(() => setModal((m) => ({ ...m, open: false })), []);
  const navigate = useCallback((dir) => setModal((m) => ({ ...m, index: (m.index + dir + PROJECTS.length) % PROJECTS.length })), []);

  return (
    <div className="site">
      <Loader />
      <Background3D />
      <ScrollChrome />
      <Nav />
      <main id="top">
        <Hero />
        <Ribbons />
        <Journey />
        <Work onOpen={openProject} />
        <Stack />
        <OffClock />
        <Contact />
      </main>
      <ProjectModal state={modal} onClose={close} onNavigate={navigate} />
    </div>
  );
}
