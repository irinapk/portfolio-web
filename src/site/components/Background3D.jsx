import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { buildKeyframes, sampleKeyframes } from "../scene/choreography";
import { HERO_CHIPS, RINGS, SECTION_IDS } from "../data/content";
import { addTick, clamp, isMobile, lerp, prefersReducedMotion, sceneStore, smoothstep } from "../lib/ticker";

// Fixed full-screen WebGL layer behind the page, plus DOM skill chips projected onto the 3D rings.
export default function Background3D() {
  const canvasRef = useRef(null);
  const chipRefs = useRef([]);
  const [fallback, setFallback] = useState(false);
  const grabRefs = useRef([]);
  const { t } = useTranslation();

  const chips = useMemo(
    () =>
      RINGS.flatMap((items, ring) =>
        items.map((label, k) => ({ label, ring, angle: (k / items.length) * Math.PI * 2 + ring * 0.6, hero: HERO_CHIPS.includes(label) })),
      ),
    [],
  );

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;
    // three.js is loaded lazily so the page content renders before the 3D bundle arrives
    import("../scene/OrbScene")
      .then(({ OrbScene }) => {
        if (cancelled) return;
        let scene;
        try {
          scene = new OrbScene(canvasRef.current);
        } catch (e) {
          setFallback(true);
          return;
        }
        cleanup = start3D(scene);
      })
      .catch(() => setFallback(true));
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [chips]);

  function start3D(scene) {
    const reduce = prefersReducedMotion();
    let keyframes = [];
    let ringsAnchorY = null;
    let current = null;
    const startTime = performance.now();

    const measure = () => {
      scene.resize();
      const vh = window.innerHeight;
      const sections = {};
      SECTION_IDS.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        sections[id] = { top: r.top + window.scrollY, height: el.offsetHeight, pin: Number(el.dataset.pin || 0) };

      });
      const { hw, hh } = scene.viewport();
      // mobile: the contact rings live in a reserved strip above the "06 Contact" label and scroll with it
      const strip = document.querySelector(".contact__rings");
      ringsAnchorY = strip && strip.offsetHeight > 0 ? strip.getBoundingClientRect().top + window.scrollY + strip.offsetHeight * 0.58 : null;
      keyframes = buildKeyframes({ hw, hh, mobile: isMobile(), vh, docHeight: document.documentElement.scrollHeight, sections });
      if (!current) current = sampleKeyframes(keyframes, window.scrollY, smoothstep);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);

    const onPointer = (e) => {
      sceneStore.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneStore.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let mobile = isMobile();
    window.addEventListener("resize", () => (mobile = isMobile()));
    // click-and-hold either ring to rotate both (mouse, pen and touch)
    const grabs = grabRefs.current.filter(Boolean);
    let dragging = null;
    const down = (e) => {
      const grab = e.currentTarget;
      dragging = { x: e.clientX, y: e.clientY, t: performance.now(), id: e.pointerId, grab };
      grab.setPointerCapture(e.pointerId);
      grabs.forEach((g) => g.classList.add("was-used"));
      grab.classList.add("is-dragging");
      scene.setTorusDragging(true);
      e.preventDefault();
    };
    const move = (e) => {
      if (!dragging || e.pointerId !== dragging.id) return;
      const now = performance.now();
      scene.dragTorus(e.clientX - dragging.x, e.clientY - dragging.y, now - dragging.t);
      dragging = { ...dragging, x: e.clientX, y: e.clientY, t: now };
    };
    const up = (e) => {
      if (!dragging || e.pointerId !== dragging.id) return;
      // a pause before releasing means "stop here", not "flick"
      if (performance.now() - dragging.t > 120) scene.dragTorus(0, 0, 1000);
      dragging.grab.classList.remove("is-dragging");
      dragging = null;
      scene.setTorusDragging(false);
    };
    const enter = () => scene.setTorusHover(true);
    const leave = () => scene.setTorusHover(false);
    grabs.forEach((grab) => {
      grab.addEventListener("pointerdown", down);
      grab.addEventListener("pointermove", move);
      grab.addEventListener("pointerup", up);
      grab.addEventListener("pointercancel", up);
      grab.addEventListener("pointerenter", enter);
      grab.addEventListener("pointerleave", leave);
    });

    const showFor = (v) => smoothstep(clamp((v - 0.55) / 0.45, 0, 1));

    let last = performance.now();
    const remove = addTick((now) => {
      const time = (now - startTime) / 1000;
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const target = sampleKeyframes(keyframes, window.scrollY, smoothstep);
      if (!target) return;
      // frame-rate independent easing toward the scroll target
      const k = reduce ? 1 : 1 - Math.exp(-dt * 5);
      for (const key in target) current[key] = lerp(current[key] ?? target[key], target[key], k);
      if (ringsAnchorY != null) {
        // pin the rings to the strip's current screen position (no easing, so they move with the page)
        const { hh } = scene.viewport();
        current.ty = hh * (1 - (2 * (ringsAnchorY - window.scrollY)) / window.innerHeight);
      }
      current.highlight = sceneStore.highlightRing;
      scene.render(current, time, sceneStore.pointer, window.scrollY, reduce);

      // keep the drag hit areas over the two contact rings
      const circles = current.torus > 0.12 ? scene.torusScreen() : null;
      grabRefs.current.forEach((grab, i) => {
        if (!grab) return;
        const c = circles?.[i];
        if (!c) {
          if (grab.style.display !== "none") grab.style.display = "none";
          return;
        }
        const r = c.r * (i === 0 ? 0.85 : 1);
        grab.style.display = "block";
        grab.style.width = grab.style.height = `${r * 2}px`;
        grab.style.transform = `translate(${c.x - r}px, ${c.y - r}px)`;
      });

      chips.forEach((chip, i) => {
        const el = chipRefs.current[i];
        if (!el) return;
        const hlRing = sceneStore.highlightRing;
        // phones show one ring of chips at a time (inner ring by default) so they don't pile up
        const ringAllowed = !mobile || chip.ring === (hlRing >= 0 ? hlRing : 0);
        const show = Math.max(ringAllowed ? showFor(current.stack) : 0, chip.hero ? showFor(current.hero) : 0) * (current.s > 0.05 ? 1 : 0);
        if (show < 0.04) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.opacity = "0";
          }
          return;
        }
        const a = chip.angle + (reduce ? 0 : time * scene.ringSpeed(chip.ring) * 0.8);
        const p = scene.projectOnRing(chip.ring, a);
        const hl = sceneStore.highlightRing;
        const dim = hl >= 0 && hl !== chip.ring ? 0.35 : 1;
        el.style.visibility = "visible";
        el.style.opacity = (show * (p.behind ? 0.35 : 1) * dim).toFixed(3);
        el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%) scale(${p.behind ? 0.82 : 1})`;
        el.style.zIndex = p.behind ? "0" : "1";
        el.classList.toggle("is-highlight", hl === chip.ring);
      });
    });

    return () => {
      remove();
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onPointer);
      grabs.forEach((grab) => {
        grab.removeEventListener("pointerdown", down);
        grab.removeEventListener("pointermove", move);
        grab.removeEventListener("pointerup", up);
        grab.removeEventListener("pointercancel", up);
        grab.removeEventListener("pointerenter", enter);
        grab.removeEventListener("pointerleave", leave);
      });
      scene.dispose();
    };
  }

  return (
    <>
      <canvas ref={canvasRef} className="gl-canvas" aria-hidden="true" />
      {fallback && <div className="orb-fallback" aria-hidden="true" />}
      <div className="gl-grab" ref={(el) => (grabRefs.current[0] = el)} style={{ display: "none" }} aria-hidden="true">
        <span className="gl-grab__hint mono">{t("contact.drag")}</span>
      </div>
      <div className="gl-grab" ref={(el) => (grabRefs.current[1] = el)} style={{ display: "none" }} aria-hidden="true" />
      <div className="gl-chips" aria-hidden="true">
        {chips.map((chip, i) => (
          <div key={chip.label} ref={(el) => (chipRefs.current[i] = el)} className="gl-chip" style={{ visibility: "hidden" }}>
            <span className="chip">{chip.label}</span>
          </div>
        ))}
      </div>
    </>
  );
}
