import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./styles/global.scss";
import "./styles/basic_components.scss";
import IntroPage from "./sections/IntroPage";
import ProjectsPage from "./sections/ProjectsPage";
import ContactPage from "./sections/ContactPage";
import SkillsPage from "./sections/SkillsPage";

function App() {
  const { t, i18n } = useTranslation();

  function switchLanguage() {
    if (i18n.language === "ko") {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("ko");
    }
  }

  return (
    <div className="app">
      <button className="lng-btn" onClick={switchLanguage}>
        <i className="bi bi-globe-americas" style={{ fontSize: "16px" }}></i>
        {i18n.language === "ko" ? "KO" : "EN"}
      </button>
      <IntroPage />
      <SkillsPage />
      <ProjectsPage />
      <ContactPage />
    </div>
  );
}

export default App;
