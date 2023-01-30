import { FloatingCircle } from "../components/MovingElements";
import "../styles/contact_styles.scss";

export default function ContactPage() {
  function onGoUp() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section className="about-section">
      <div className="section-heading">
        <h1 className="shadow-text">ABOUT</h1>
        <h1>More about me...</h1>
      </div>

      <FloatingCircle
        diameter={250}
        shape="donut"
        position={{ top: 0, left: 20 }}
      />
      <FloatingCircle
        className="circle-3-blue"
        diameter={150}
        position={{ top: 20, left: 300 }}
      />
      <FloatingCircle diameter={60} position={{ top: 150, left: 450 }} />
      <FloatingCircle diameter={350} position={{ top: 0, right: -50 }} />
      <FloatingCircle
        className="circle-1-blue"
        diameter={70}
        shape="donut"
        position={{ top: 100, right: "20%" }}
      />
      <FloatingCircle
        className="circle-3-blue"
        diameter={100}
        position={{ top: 150, right: "25%" }}
      />

      <div className="last-profile-img">
        <img
          src="/images/profile_2.png"
          alt={"irina_photo"}
          width={250}
          height={250}
        />
      </div>

      <div className="conclusion">
        <p>
          I love food, animals and music. I also enjoy exploring new places and
          spending quality time with my family, friends and my cat. During my
          free time I like watching movies, and sometimes I try to teach myself
          playing guitar or I read books &#40;psychology, novels, fantasy,
          etc.&#41;
        </p>
        <br />
        <p>
          Thank you for your interest! If you would like to ask any questions or
          to chat, feel free to email me or find me on social media :&#41;
        </p>
      </div>

      <FloatingCircle diameter={30} position={{ bottom: "12%", left: "20%" }} />
      <FloatingCircle
        className="circle-2-blue"
        diameter={90}
        shape="donut"
        position={{ bottom: "10%", left: "10%" }}
      />
      <FloatingCircle
        className="circle-5-blue"
        diameter={120}
        position={{ bottom: "15%", left: "25%" }}
      />

      <button className="top-btn" onClick={onGoUp}>
        UP
      </button>
    </section>
  );
}
