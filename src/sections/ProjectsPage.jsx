import "../styles/project_styles.scss";
import ProjectCard from "../components/ProjectCard";
import { FloatingCircle } from "../components/MovingElements";

const myProjects = [
  {
    name: "Felicity Work Planner (2023)",
    description: "ProjectDescription.Felicity",
    tags: "#NextJS13   #Vercel    #MaterialUI   #reactBeautifulDnd\n #WYSIWYG",
    images: ["/images/projects/felicity_1.png"],
  },
  {
    name: "Admin Portal (2022)",
    description: "ProjectDescription.AdminPortal",
    tags: "#ReactJS   #MaterialUI     #fileUpload  #imageDragAndDrop #YouTubePreview",
    images: ["/images/projects/admin_1.png", "/images/projects/admin_2.png", "/images/projects/admin_3.png"],
  },
  {
    name: "Guardian Web Portal (2022)",
    description: "ProjectDescription.GuardianPortal",
    tags: "#ReactJS   #NextJS  #lodash    #MaterialUI   #JQuery    #Swiper   #Slider  #SockJS   #ChartJS    #reactForChartJS    #infinteScroll",
    images: ["/images/projects/guardian_1.png", "/images/projects/guardian_2.png", "/images/projects/guardian_3.png"],
  },
  {
    name: "Developers Docs Website  (2021)",
    description: "ProjectDescription.DevelopersSite",
    tags: "#Docusaurus    #MarkupDocumentation    #localization",
    images: ["/images/projects/developers_1.png", "/images/projects/developers_2.png"],
  },
  {
    name: "Moy Sklad Clone (2021)",
    description: "ProjectDescription.MoySklad",
    tags: "#CloneProject   #JavaSpringBoot   #PostgreSQL  #Vaadin   #Docker   #GitLab",
    images: ["/images/projects/sklad_clone_1.png", "/images/projects/sklad_clone_2.png"],
  },
];

export default function ProjectsPage() {
  return (
    <section className="projects-section">
      <div className="section-heading">
        <h1 className="shadow-text">PROJECTS</h1>
        <h1>Projects</h1>
      </div>
      <FloatingCircle diameter={600} shape="donut" className="circle-1-pink" position={{ top: "5%", left: "20%" }} />
      <FloatingCircle className="circle-2-pink" diameter={130} position={{ top: "25%", right: "45%" }} />
      <FloatingCircle diameter={300} shape="donut" className="circle-4-pink" position={{ top: "55%", left: "46%" }} />
      <FloatingCircle className="circle-3-pink" diameter={70} position={{ top: "58%", right: "54%" }} />
      <FloatingCircle className="circle-1-pink" diameter={440} position={{ top: "70%", left: "25%" }} />
      <FloatingCircle className="circle-2-pink" diameter={540} shape="donut" position={{ top: "78%", right: "17%" }} />
      <FloatingCircle className="circle-1-pink" diameter={170} position={{ top: "83%", right: "7%" }} />
      <FloatingCircle className="circle-5-pink" diameter={100} position={{ top: "90%", right: "5%" }} />
      {myProjects.map((project, idx) => (
        <div className="project-area" key={project.name}>
          {idx % 2 !== 0 && (
            <div className="project-img img-left">
              {project.images.map((image, i) => (
                <img src={image} alt={project.name + i} key={project.name + i} />
              ))}
            </div>
          )}
          <ProjectCard project={project} side={idx % 2 === 0 ? "left" : "right"} />
          {idx % 2 === 0 && (
            <div className="project-img img-right">
              {project.images.map((image, i) => (
                <img src={image} alt={project.name + i} key={project.name + i} />
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
