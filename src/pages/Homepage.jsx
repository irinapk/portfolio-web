import "../styles/homepage.scss";
import ProfileImg from "../assets/images/profile-pic.png";
import ArrowDown from '../assets/images/arrow_down.svg';
import KeyboardImg from '../assets/images/keyboard.png';
import {Autoplay, Pagination} from "swiper/modules";
import {Swiper, SwiperSlide} from "swiper/react";
import CssLogo from '../assets/images/logos/front/image 10.png';
import JsLogo from '../assets/images/logos/front/image 11.png';
import ReactLogo from '../assets/images/logos/front/image 12.png';
import HtmlLogo from '../assets/images/logos/front/image 32.png';
import SassLogo from '../assets/images/logos/front/image 36.png';
import TsLogo from '../assets/images/logos/front/image 49.png';
import NextLogo from '../assets/images/logos/front/image 50.png';
import MuiLogo from '../assets/images/logos/front/image 60.png';
import BoostrapLogo from '../assets/images/logos/front/image 64.png';
import TailwindLogo from '../assets/images/logos/front/image 65.png';

import MySqlLogo from '../assets/images/logos/back/image 7.png';
import HarperLogo from '../assets/images/logos/back/image 34.png';
import JavaLogo from '../assets/images/logos/back/image 35.png';
import SpringLogo from '../assets/images/logos/back/image 56.png';
import ExpressLogo from '../assets/images/logos/back/image 61.png';
import GraphLogo from '../assets/images/logos/back/image 63.png';

import AwsLogo from '../assets/images/logos/tools/image 57.png';
import VisualLogo from '../assets/images/logos/tools/image 59.png';
import FirebaseLogo from '../assets/images/logos/tools/image 62.png';
import JenkinsLogo from '../assets/images/logos/tools/image 77.png';
import IdeaLogo from '../assets/images/logos/tools/image 78.png';

import GitLabLogo from '../assets/images/logos/collaboration/image 18.png';
import FigmaLogo from '../assets/images/logos/collaboration/image 52.png';
import NotionLogo from '../assets/images/logos/collaboration/image 53.png';
import SlackLogo from '../assets/images/logos/collaboration/image 54.png';
import GithubLogo from '../assets/images/logos/collaboration/image 55.png';
import {useState} from "react";
import SelectBox from "../components/SelectBox";




export default function Homepage() {

  const frontLogoList = [HtmlLogo, JsLogo, CssLogo, ReactLogo, TsLogo, TailwindLogo, NextLogo, BoostrapLogo, SassLogo, MuiLogo];
  const backLogoList = [JavaLogo, MySqlLogo, SpringLogo, GraphLogo, ExpressLogo, HarperLogo];
  const toolsLogoList = [AwsLogo, IdeaLogo, VisualLogo, FirebaseLogo, JenkinsLogo];
  const collabLogoList = [GithubLogo, NotionLogo, SlackLogo, FigmaLogo, GitLabLogo];

  const projects = [
    {},
    {},
    {},
    {},
    {},
  ]

  const blogs = [
    {},
    {},
    {},
    {},
    {},
  ]

  const filterNames = ["React", "Java / Springboot", "NextJS", "Typescript", "Back-end", "Study projects"]

  function FilterTag({name, onClick}) {

    const [selected, setSelected] = useState(false);

    const onClickTag = () => {
      setSelected(!selected);
      onClick();
    }

    return (
      <div onClick={onClickTag} className={`filter-tag${selected ? " selected-tag" : ""}`}>
        <span>{name}</span>
      </div>
    )
  }

  return (
    <main className="homepage">
      <article id="about-me">
        <h1 className="shadow-text">About me</h1>
        <div className="intro-text">
          <h1>Hey there!</h1>
          <hr/>
          <p>I'm <b>Irina</b>, an aspiring full-stack developer based in Seoul. As the IT industry evolves rapidly,
            my commitment as a software developer is to stay abreast of new technologies, continually enhance my skills, and
            maximize my potential.</p>
          <p>I love bringing websites to life with style and functionality. Whether it's crafting pixel-perfect layouts
            or adding interactive elements, I thrive on creating web magic that's both visually appealing and
            user-friendly.</p>
          <p>Take a peek at my portfolio and let's bring your next project to life together!
          </p>
          <a href="/files/Irina_CV_ENG.pdf" download>
            <button type="button" className="basic-btn">Download CV</button>
          </a>
        </div>
        <img src={ProfileImg} alt="profile" height={600}/>
      </article>


      <article id="skills">
        <div className="arrow-page-down">
          <ArrowDown />
        </div>
        <div className="header-title">
          <h1 className="shadow-text">STACK</h1>
          <h1>Skills & Tools</h1>
          <hr/>
        </div>
        <div className="skills-summary">
          <p>Since 2021, I've had the opportunity to contribute to over <strong>13 various projects</strong>,
            mostly working on the development of administration and monitoring systems for businesses.</p>
          <p> My current passion lies in React.js, making front-end development and website publishing my areas of expertise.</p>
          <p>I enjoy witnessing ideas transform from concepts and content into interactive solutions that deliver tangible value.</p>
        </div>

        <div className="skills-grid">
          <div>
            <h2>Front-end development</h2>
            {frontLogoList.map((imgSrc, idx) => (
              <img src={imgSrc} key={"logo-front-"+idx} alt={"logo-front-"+idx}
                   height={70} style={{margin: '0 20px'}}/>
            ))}
          </div>
          <div>
            <h2>Back-end development</h2>
            {backLogoList.map((imgSrc, idx) => (
              <img src={imgSrc} key={"logo-front-"+idx} alt={"logo-front-"+idx} height={60}/>
            ))}
          </div>
          <div>
            <h2>Infrastructure & Tools</h2>
            {toolsLogoList.map((imgSrc, idx) => (
              <img src={imgSrc} key={"logo-front-"+idx} alt={"logo-front-"+idx} height={60}/>
            ))}
          </div>
          <div>
            <h2>Collaboration</h2>
            {collabLogoList.map((imgSrc, idx) => (
              <img src={imgSrc} key={"logo-front-"+idx} alt={"logo-front-"+idx} height={70}/>
            ))}
          </div>
        </div>

      </article>

      <article id="projects">
        <div className="arrow-page-down">
          <ArrowDown />
        </div>
        <div className="header-title">
          <h1 className="shadow-text">PROJECTS</h1>
          <h1>Projects</h1>
          <hr/>
        </div>
        <div>
          <SelectBox id={"year-select"} defaultValue={"All"}
                     height={144}
                     options={["All", 2021, 2022, 2023, 2024]}/>
          <div className="project-filters">
            {filterNames.map((name) => (
              <FilterTag name={name} key={name} onClick={() => {}}/>
            ))}
          </div>

          {projects.map((project, idx) => (
            <div key={"prj-"+idx} className="prj-box">

            </div>
          ))}
        </div>
      </article>

      <article id="personal-blog">
        <div className="arrow-page-down">
          <ArrowDown />
        </div>
        <div className="header-title">
          <h1 className="shadow-text">BLOG</h1>
          <h1>Personal blog</h1>
          <hr/>
        </div>
        <Swiper pagination={{clickable: true}} modules={[Pagination, Autoplay]}
                slidesPerView={1} slidesPerGroup={1}
                breakpoints={{
                  1000: {
                    slidesPerView: 2,
                    slidesPerGroup: 2
                  },
                  1400: {
                    slidesPerView: 3,
                    slidesPerGroup: 3
                  }
                }}
                spaceBetween={20} autoplay={false} loop={true}
                className="blog-swiper">
          {blogs.map((blog, idx) => (
            <SwiperSlide key={"blog-slide-" + idx}>
              <div className="blog-box">

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </article>

      <article id="contact-me">
        <div className="header-title">
          <h1 className="shadow-text">CONTACT</h1>
          <h1>Get in touch</h1>
          <hr/>
        </div>
        <div>
          <div>
            <p>Thank you for your interest!</p>
            <p>If you have any questions or would like to chat,
              please feel free to email me or connect with me on social media :)</p>
            <img src={KeyboardImg} alt="keyboard" width={'70%'}/>
          </div>
          <div className="email-form">
            <textarea id="email-content" rows="10" />
            <button type="button" className="basic-btn">Send</button>
          </div>
        </div>
      </article>

      <div className="sns-box">
        <a href="mailto:irina.park.8@gmail.com" target="_blank">
          <i className="bi bi-envelope-at-fill"/>
        </a>
        <KakaoLogo onClick={() => window.open("/images/KakaoTalk_friend.png")}/>
        <i className="bi bi-instagram" onClick={() => window.open("https://www.instagram.com/irinapark8/")}/>
        <i className="bi bi-messenger" onClick={() => window.open("https://m.me/irina.park.8")}/>
        <i className="bi bi-github" onClick={() => window.open("https://github.com/irinapk/")}/>
      </div>
    </main>
  )
}


function KakaoLogo(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="37" height="37" viewBox="0 0 256 256" onClick={props?.onClick}>
      <path fill="#FFFFFF00" d="M256 236c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0h216c11.046 0 20 8.954 20 20v216z" />
      <path
        fill="#000000"
        d="M128 36C70.562 36 24 72.713 24 118c0 29.279 19.466 54.97 48.748 69.477-1.593 5.494-10.237 35.344-10.581 37.689 0 0-.207 1.762.934 2.434s2.483.15 2.483.15c3.272-.457 37.943-24.811 43.944-29.04 5.995.849 12.168 1.29 18.472 1.29 57.438 0 104-36.712 104-82 0-45.287-46.562-82-104-82z"
      />
      <path
        fill="#293D40"
        d="M70.5 146.625c-3.309 0-6-2.57-6-5.73V105.25h-9.362c-3.247 0-5.888-2.636-5.888-5.875s2.642-5.875 5.888-5.875h30.724c3.247 0 5.888 2.636 5.888 5.875s-2.642 5.875-5.888 5.875H76.5v35.645c0 3.16-2.691 5.73-6 5.73zM123.112 146.547c-2.502 0-4.416-1.016-4.993-2.65l-2.971-7.778-18.296-.001-2.973 7.783c-.575 1.631-2.488 2.646-4.99 2.646a9.155 9.155 0 0 1-3.814-.828c-1.654-.763-3.244-2.861-1.422-8.52l14.352-37.776c1.011-2.873 4.082-5.833 7.99-5.922 3.919.088 6.99 3.049 8.003 5.928l14.346 37.759c1.826 5.672.236 7.771-1.418 8.532a9.176 9.176 0 0 1-3.814.827c-.001 0 0 0 0 0zm-11.119-21.056L106 108.466l-5.993 17.025h11.986zM138 145.75c-3.171 0-5.75-2.468-5.75-5.5V99.5c0-3.309 2.748-6 6.125-6s6.125 2.691 6.125 6v35.25h12.75c3.171 0 5.75 2.468 5.75 5.5s-2.579 5.5-5.75 5.5H138zM171.334 146.547c-3.309 0-6-2.691-6-6V99.5c0-3.309 2.691-6 6-6s6 2.691 6 6v12.896l16.74-16.74c.861-.861 2.044-1.335 3.328-1.335 1.498 0 3.002.646 4.129 1.772 1.051 1.05 1.678 2.401 1.764 3.804.087 1.415-.384 2.712-1.324 3.653l-13.673 13.671 14.769 19.566a5.951 5.951 0 0 1 1.152 4.445 5.956 5.956 0 0 1-2.328 3.957 5.94 5.94 0 0 1-3.609 1.211 5.953 5.953 0 0 1-4.793-2.385l-14.071-18.644-2.082 2.082v13.091a6.01 6.01 0 0 1-6.002 6.003z"
      />
    </svg>
  );
}

