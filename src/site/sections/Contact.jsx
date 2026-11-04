import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SectionLabel } from "./Journey";
import { CopyIcon } from "../components/Icons";
import { CV_URL, EMAIL, SOCIALS } from "../data/content";

function HoverLetters({ text }) {
  return text.split(" ").map((word, w, arr) => (
    <Fragment key={w}>
      <span className="word">
        {[...word].map((c, i) => (
          <span className="ch" key={i}>
            {c}
          </span>
        ))}
      </span>
      {w < arr.length - 1 ? " " : null}
    </Fragment>
  ));
}

export default function Contact() {
  const { t } = useTranslation();
  const [toast, setToast] = useState("");
  const timer = useRef(0);
  const clock = useRef(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const update = () => clock.current && (clock.current.textContent = `${t("contact.local")} ${fmt.format(new Date())} KST`);
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [t]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setToast(t("contact.copied"));
    } catch {
      setToast(t("contact.blocked"));
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2200);
  };

  return (
    <section className="contact wrap" id="contact">
      <div data-reveal>
        {/* empty strip that holds the 3D rings on phones */}
        <div className="contact__rings" aria-hidden="true" />
        <SectionLabel index="06" text={t("contact.label")} />
        <h2 className="contact__title">
          <HoverLetters text={t("contact.title")} />
        </h2>
        <div className="contact__mail">
          <a className="contact__addr" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
          <button className="btn btn--primary magnetic" onClick={copy}>
            <span>{t("contact.copy")}</span>
            <CopyIcon />
          </button>
        </div>
        <div className="contact__socials">
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label} ↗
            </a>
          ))}
          <a href={CV_URL} download>
            CV (PDF) ↓
          </a>
        </div>
      </div>
      <footer className="contact__foot mono">
        <span>© 2026 Irina Park</span>
        <span>{t("contact.made")}</span>
        <span ref={clock} />
      </footer>
      <div className={`toast${toast ? " is-shown" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </section>
  );
}
