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
            {frontLogoList.map((imgSrc, idx) => (
              <img src={imgSrc} key={"logo-front-"+idx} alt={"logo-front-"+idx}
                   height={70} style={{margin: '0 20px'}}/>
            ))}
          </div>
          <div>
            {backLogoList.map((imgSrc, idx) => (
              <img src={imgSrc} key={"logo-front-"+idx} alt={"logo-front-"+idx} height={60}/>
            ))}
          </div>
          <div>
            {toolsLogoList.map((imgSrc, idx) => (
              <img src={imgSrc} key={"logo-front-"+idx} alt={"logo-front-"+idx} height={60}/>
            ))}
          </div>
          <div>
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
    </main>
  )
}