import React from "react";
import { useTranslation } from "react-i18next";
import "swiper/css/bundle";
import "./styles/global.scss";
import "./styles/basic_components.scss";
import { ImageOverlayProvider } from './components/ImageOverlayContext';
import TopBar from "./components/TopBar.jsx";
import {Route, Routes} from 'react-router';
import Homepage from "./pages/Homepage.jsx";
import ProjectPage from "./pages/ProjectPage.jsx";

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
    <ImageOverlayProvider>
      <div className="app">
        <TopBar />
        {/*<button className="lng-btn" onClick={switchLanguage}>*/}
        {/*  <i className="bi bi-globe-americas" style={{ fontSize: "16px" }}></i>*/}
        {/*  {i18n.language === "ko" ? "KO" : "EN"}*/}
        {/*</button>*/}

        <Routes>
          <Route path={"/"} element={<Homepage/>}/>
          <Route path={"/project"} element={<ProjectPage/>}/>
        </Routes>
      </div>
    </ImageOverlayProvider>
  );
}

export default App;
