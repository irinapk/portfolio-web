import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "./Icons";

/**
 * Full-size image viewer used inside the project modal.
 * - Fit mode: the whole image fits the screen.
 * - Actual size: click the image (or the button) to see it at 100% and scroll/drag around it.
 * - ← / → or swipe to step through, Esc to close.
 * Keyboard handling lives in ProjectModal so the modal and the viewer never both react to a key.
 */
export default function Lightbox({ images, index, title, onClose, onStep }) {
  const { t } = useTranslation();
  const [actual, setActual] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const stageRef = useRef(null);
  const closeRef = useRef(null);
  const drag = useRef(null);
  const touch = useRef(null);
  const src = images[index];

  useEffect(() => {
    setActual(false);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // when switching to actual size, keep the clicked point under the pointer
  const toggleActual = (e) => {
    const stage = stageRef.current;
    const img = e?.currentTarget;
    if (!actual && img && stage && e.clientX != null) {
      const r = img.getBoundingClientRect();
      const fx = (e.clientX - r.left) / r.width;
      const fy = (e.clientY - r.top) / r.height;
      setActual(true);
      requestAnimationFrame(() => {
        stage.scrollLeft = fx * img.naturalWidth - stage.clientWidth / 2;
        stage.scrollTop = fy * img.naturalHeight - stage.clientHeight / 2;
      });
    } else {
      setActual((a) => !a);
    }
  };

  // drag to pan in actual-size mode (mouse)
  const onPointerDown = (e) => {
    if (!actual || e.pointerType !== "mouse") return;
    const s = stageRef.current;
    drag.current = { x: e.clientX, y: e.clientY, l: s.scrollLeft, t: s.scrollTop, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    stageRef.current.scrollLeft = d.l - dx;
    stageRef.current.scrollTop = d.t - dy;
  };
  const onPointerUp = () => {
    setTimeout(() => (drag.current = null), 0);
  };
  const onImageClick = (e) => {
    e.stopPropagation();
    if (drag.current?.moved) return; // finished a pan, not a click
    toggleActual(e);
  };

  // swipe to step (touch, fit mode only)
  const onTouchStart = (e) => {
    if (actual || e.touches.length !== 1) return;
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    const s = touch.current;
    touch.current = null;
    if (!s || actual) return;
    const dx = e.changedTouches[0].clientX - s.x, dy = e.changedTouches[0].clientY - s.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) onStep(dx < 0 ? 1 : -1);
  };

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={t("lightbox.label", { title })}>
      <div className="lightbox__bar">
        <span className="mono muted">
          {String(index + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
        <div className="lightbox__actions">
          <button className="lightbox__zoom mono" onClick={() => setActual((a) => !a)} aria-pressed={actual}>
            {actual ? t("lightbox.fit") : t("lightbox.actual")}
          </button>
          <button className="icon-btn" ref={closeRef} onClick={onClose} aria-label={t("lightbox.close")}>
            <CloseIcon />
          </button>
        </div>
      </div>

      <div
        className={`lightbox__stage${actual ? " is-actual" : ""}`}
        ref={stageRef}
        onClick={onClose}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {!loaded && <div className="lightbox__spinner" aria-hidden="true" />}
        <img
          key={src}
          src={src}
          alt={`${title}, screen ${index + 1}`}
          className={loaded ? "is-loaded" : ""}
          onLoad={() => setLoaded(true)}
          onClick={onImageClick}
          draggable={false}
        />
      </div>

      {images.length > 1 && (
        <>
          <button className="lightbox__arrow lightbox__arrow--prev" onClick={() => onStep(-1)} aria-label={t("lightbox.prev")}>
            ←
          </button>
          <button className="lightbox__arrow lightbox__arrow--next" onClick={() => onStep(1)} aria-label={t("lightbox.next")}>
            →
          </button>
        </>
      )}
      <p className="lightbox__hint mono muted">{t("lightbox.hint")}</p>
    </div>
  );
}
