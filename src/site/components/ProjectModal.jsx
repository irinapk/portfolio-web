import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloseIcon } from "./Icons";
import Lightbox from "./Lightbox";
import { PROJECTS, imgUrl } from "../data/projects";

/** Full-screen project details, revealed with a circle that grows from the click point. */
export default function ProjectModal({ state, onClose, onNavigate }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  const open = state.open;
  const project = PROJECTS[state.index] ?? PROJECTS[0];
  const gallery = project.images.filter((src) => src !== project.cover);
  const allImages = [project.cover, ...gallery].map(imgUrl);

  // full-size viewer: index into allImages, or null when closed
  const [viewer, setViewer] = useState(null);
  const viewerRef = useRef(null);
  const thumbRef = useRef(null);
  viewerRef.current = viewer;
  const openViewer = (i, e) => {
    thumbRef.current = e.currentTarget;
    setViewer(i);
  };
  const closeViewer = () => {
    setViewer(null);
    requestAnimationFrame(() => thumbRef.current?.focus());
  };
  const stepViewer = (dir) => setViewer((v) => (v == null ? v : (v + dir + allImages.length) % allImages.length));
  const stepRef = useRef(stepViewer);
  stepRef.current = stepViewer;
  const closeViewerRef = useRef(closeViewer);
  closeViewerRef.current = closeViewer;

  useEffect(() => setViewer(null), [state.index, open]);

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    document.body.style.overflow = "hidden";
    const id = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e) => {
      if (viewerRef.current != null) {
        if (e.key === "Escape") closeViewerRef.current();
        if (e.key === "ArrowRight") stepRef.current(1);
        if (e.key === "ArrowLeft") stepRef.current(-1);
        return;
      }
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate(1);
      if (e.key === "ArrowLeft") onNavigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(id);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose, onNavigate]);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = 0;
  }, [state.index]);

  return (
    <div
      ref={ref}
      className={`modal${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-hidden={!open}
      style={{ "--cx": `${state.x}px`, "--cy": `${state.y}px` }}
    >
      <div className="modal__inner">
        <div className="modal__top">
          <span className="mono muted">
            {String(state.index + 1).padStart(2, "0")} / {PROJECTS.length}
          </span>
          <button className="icon-btn" ref={closeRef} onClick={onClose} aria-label={t("modal.close")} tabIndex={open ? 0 : -1}>
            <CloseIcon />
          </button>
        </div>
        <header className="modal__head">
          <span className="mono modal__meta">
            {project.company} · {project.year}
          </span>
          <h2 id="modal-title">{project.title}</h2>
          {project.ko && <span className="muted">{project.ko}</span>}
        </header>
        <button className="modal__cover zoomable" onClick={(e) => openViewer(0, e)} tabIndex={open ? 0 : -1} aria-label={t("lightbox.open")}>
          <img src={allImages[0]} alt={`${project.title} screenshot`} />
          <span className="zoomable__badge mono" aria-hidden="true">
            {t("lightbox.badge")}
          </span>
        </button>
        <div className="modal__cols">
          <div className="modal__col">
            <span className="mono muted">{t("modal.overview")}</span>
            <p className="lede">{project.description}</p>
            <div className="tags">
              {project.stack.map((s) => (
                <span className="tag" key={s}>
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="modal__col">
            <span className="mono muted">{t("modal.did")}</span>
            <ul className="modal__work">
              {project.work.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
        {gallery.length > 0 && (
          <div className="modal__gallery-wrap">
            <span className="mono muted">{t("modal.gallery")}</span>
            <div className="modal__gallery">
              {gallery.map((src, i) => (
                <button key={src} className="zoomable" onClick={(e) => openViewer(i + 1, e)} tabIndex={open ? 0 : -1} aria-label={t("lightbox.open")}>
                  <img src={imgUrl(src)} alt="" loading="lazy" />
                  <span className="zoomable__badge mono" aria-hidden="true">
                    {t("lightbox.badge")}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="modal__nav">
          <button className="btn btn--ghost" onClick={() => onNavigate(-1)} tabIndex={open ? 0 : -1}>
            ← {t("modal.prev")}
          </button>
          <button className="btn btn--ghost" onClick={() => onNavigate(1)} tabIndex={open ? 0 : -1}>
            {t("modal.next")} →
          </button>
        </div>
      </div>
      {open && viewer != null && (
        <Lightbox images={allImages} index={viewer} title={project.title} onClose={closeViewer} onStep={stepViewer} />
      )}
    </div>
  );
}
