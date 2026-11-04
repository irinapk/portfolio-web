import { useTranslation } from "react-i18next";
import { Rich } from "./Hero";
import { SectionLabel } from "./Journey";
import { TileIcons } from "../components/Icons";

// Fixed bento layout: every tile sits on the same grid with the same gap (no scroll parallax).
const TILES = ["food", "cat", "music", "books", "movies", "places", "people"];

export default function OffClock() {
  const { t } = useTranslation();
  return (
    <section className="offclock wrap" id="offclock">
      <div className="section-head" data-reveal>
        <div className="stack-sm">
          <SectionLabel index="05" text={t("off.label")} />
          <h2 className="h-big">
            <Rich k="off.title" />
          </h2>
        </div>
        <p className="lede lede--narrow">{t("off.lede")}</p>
      </div>
      <div className="bento" data-reveal>
        <figure className="tile tile--photo">
          <img src="/images/profile.png" alt={t("off.photoAlt")} loading="lazy" />
          <figcaption className="mono">{t("off.photo")}</figcaption>
        </figure>
        {TILES.map((key) => {
          const Icon = TileIcons[key];
          return (
            <div className={`tile tile--${key}`} key={key}>
              <div className="tile__ico">
                <Icon />
              </div>
              <div>
                <h3>{t(`off.tiles.${key}.title`)}</h3>
                <p>{t(`off.tiles.${key}.text`)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
