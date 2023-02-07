import React from "react";
import { useTranslation } from "react-i18next";
import { FloatingCircle } from "../components/MovingElements";

export default function IntroPage() {
  const { t } = useTranslation();

  return (
    <section className="section-intro">
      <div
        className="intro-area"
        dangerouslySetInnerHTML={{
          __html: t("HeyThere", { interpolation: { escapeValue: false } }),
        }}
      />
      <div className="profile">
        <div>
          <p>{t("Biography.First")}</p>
          <p>{t("Biography.Second")}</p>
          <a href="/files/Irina_CV_ENG.pdf" download>
            <button className="donwload-btn">Download CV</button>
          </a>
        </div>
        <img src="/images/profile.png" alt="my_profile" width={410} height={410} />
      </div>
      <FloatingCircle diameter={350} position={{ top: -60, left: -30 }} />
      <FloatingCircle className="circle-1-blue" diameter={70} shape="donut" position={{ top: 200, left: "20%" }} />
      <FloatingCircle className="circle-2-blue" diameter={100} position={{ top: 300, left: "15%" }} />
      <FloatingCircle diameter={400} shape="donut" position={{ bottom: "15%", right: "10%" }} />
      <FloatingCircle className="circle-1-blue" diameter={50} position={{ bottom: "15%", right: "35%" }} />
      <FloatingCircle className="circle-3-blue" diameter={80} position={{ bottom: "10%", right: "40%" }} />
      <FloatingCircle className="circle-2-blue" diameter={25} position={{ bottom: "13%", left: "18%" }} />
      <FloatingCircle className="circle-4-blue" diameter={40} position={{ bottom: "17%", left: "15%" }} />
      <FloatingCircle className="circle-3-blue" diameter={70} position={{ bottom: "22%", left: "10%" }} />
    </section>
  );
}
