import "@styles/project.scss";
import { data } from "@assets/data/projects.json";
import { useLocation } from 'react-router-dom';
import React, {useEffect, useState} from "react";
import {Autoplay, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide, useSwiper} from "swiper/react";


export default function ProjectPage() {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Parse query string
  const prjId = queryParams ? parseInt(queryParams.get('id')) : null;
  const prjData = data[prjId];

  const [pageLoaded, setPageLoaded] = useState(false);
  const [swiperRef, setSwiperRef] = useState(null);

  useEffect(() => {
    setPageLoaded(true);
  }, [])


  return (
    <main className="project-page">
      <section className="project-page-grid">
        <div className={pageLoaded ? 'fade-in' : ''}>
          <h1>{prjData.title}</h1>
          <div className="block-title">
            <img src="src/assets/images/icons/building.png" alt="docs-icon" height={22}/>
            <h2>{prjData.company}</h2>
          </div>
          <div className="block-title">
            <img src="src/assets/images/icons/docs.png" alt="docs-icon" height={22}/>
            <h3>Description</h3>
          </div>
          <p>
            {prjData.description}
          </p>
          <div className="block-title">
            <img src="src/assets/images/icons/stack.png" alt="docs-icon" height={22}/>
            <h3>Project stack</h3>
          </div>
          <ul>
            {prjData.stack.map((item, idx) => (
              <li key={'stack'+idx}>{item}</li>
            ))}
          </ul>
          <div className="block-title">
            <img src="src/assets/images/icons/code.png" alt="docs-icon" height={22}/>
            <h3>Main contributions</h3>
          </div>
          <ul>
            {prjData.work.map((item, idx) => (
              <li key={'work'+idx}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <Swiper slidesPerView={1}
                  onSwiper={(s) => setSwiperRef(s)}
                  spaceBetween={20} autoplay={false} loop={true}
                  className="project-swiper">
            {prjData?.img.map((img, idx) => (
              <SwiperSlide key={"prj-img-slide-" + idx}>
                {img.includes("mp4") ?
                  <video controls loop autoPlay src={"src/assets/images/projects/"+img} type="video/mp4" />
                  :
                  <img src={"src/assets/images/projects/"+img} alt="image"/>
                }
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="slider-control">
            <button type='button' className="basic-btn"
                    onClick={() => swiperRef?.slidePrev()}>{"< PREV"}</button>
            <button type='button' className="basic-btn"
                    onClick={() => swiperRef?.slideNext()}>{"NEXT >"}</button>
          </div>
        </div>
      </section>

    </main>
  )
}