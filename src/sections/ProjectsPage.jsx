import "../styles/project_styles.scss";
import ProjectCard from "../components/ProjectCard";
import { FloatingCircle } from "../components/MovingElements";

const myProjects = [
  {
    name: "Felicity Work Planner (2023)",
    description:
      "a personal study project - a simple minimalistic web application for team collaboration and task management",
  },
];

export default function ProjectsPage() {
  return (
    <section className="projects-section">
      <div className="section-heading">
        <h1 className="shadow-text">PROJECTS</h1>
        <h1>Projects</h1>
      </div>
      <FloatingCircle
        diameter={600}
        shape="donut"
        className="circle-1-pink"
        position={{ top: "5%", left: "20%" }}
      />
      <FloatingCircle
        className="circle-2-pink"
        diameter={130}
        position={{ top: "25%", right: "45%" }}
      />
      <FloatingCircle
        diameter={300}
        shape="donut"
        className="circle-4-pink"
        position={{ top: "55%", left: "46%" }}
      />
      <FloatingCircle
        className="circle-3-pink"
        diameter={70}
        position={{ top: "58%", right: "54%" }}
      />
      <FloatingCircle
        className="circle-1-pink"
        diameter={440}
        position={{ top: "70%", left: "25%" }}
      />
      <FloatingCircle
        className="circle-2-pink"
        diameter={540}
        shape="donut"
        position={{ top: "78%", right: "17%" }}
      />
      <FloatingCircle
        className="circle-1-pink"
        diameter={170}
        position={{ top: "83%", right: "7%" }}
      />
      <FloatingCircle
        className="circle-5-pink"
        diameter={100}
        position={{ top: "90%", right: "5%" }}
      />
      <div className="project-area">
        <ProjectCard project={myProjects[0]} />
      </div>
      <div className="project-area">
        <ProjectCard side="left" />
      </div>
      <div className="project-area">
        <ProjectCard />
      </div>
      <div className="project-area">
        <ProjectCard side="left" />
      </div>
      <div className="project-area">
        <ProjectCard />
      </div>
      <div className="project-area">
        <ProjectCard side="left" />
      </div>
    </section>
  );
}
