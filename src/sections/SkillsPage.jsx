import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { Autoplay, FreeMode } from "swiper";

const logoImages = [
  { imageUrl: "/images/logo/html.png", imageName: "html-logo" },
  { imageUrl: "/images/logo/css.png", imageName: "css-logo" },
  { imageUrl: "/images/logo/javascript.png", imageName: "javascript-logo" },
  { imageUrl: "/images/logo/java.png", imageName: "java-logo" },
  { imageUrl: "/images/logo/spring.png", imageName: "spring-logo" },
  { imageUrl: "/images/logo/github.png", imageName: "github-logo" },
  { imageUrl: "/images/logo/gitlab.png", imageName: "gitlab-logo" },
  { imageUrl: "/images/logo/mysql.png", imageName: "mysql-logo" },
  { imageUrl: "/images/logo/harper.png", imageName: "harper-logo" },
  { imageUrl: "/images/logo/reactjs.png", imageName: "reactjs-logo" },
  { imageUrl: "/images/logo/nextjs.png", imageName: "nextjs-logo" },
  { imageUrl: "/images/logo/sass.png", imageName: "sass-logo" },
  { imageUrl: "/images/logo/figma.png", imageName: "figma-logo" },
];

export default function SkillsPage() {
  return (
    <div
      style={{
        width: "100%",
        marginTop: "120px",
        marginBottom: "120px",
        position: "relative",
      }}
    >
      <div className="section-heading">
        <h1 className="shadow-text">STACK</h1>
        <h1>Skills & Tools</h1>
      </div>

      <div className="stack-area">
        <Swiper
          slidesPerView={10}
          spaceBetween={10}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            reverseDirection: false,
            waitForTransition: true,
          }}
          breakpoints={{
            320: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            600: {
              slidesPerView: 7,
              spaceBetween: 10,
            },
            1300: {
              slidesPerView: 10,
              spaceBetween: 10,
            },
          }}
          speed={4000}
          loop={true}
          loopFillGroupWithBlank={false}
          freeMode={true}
          modules={[FreeMode, Autoplay]}
          className="mySwiper"
        >
          {logoImages.map((i, idx) => (
            <SwiperSlide key={"slide" + idx}>
              <img src={i.imageUrl} alt={i.imageName} height={80} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
