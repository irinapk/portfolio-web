import { useTranslation } from "react-i18next";
import "../styles/project_styles.scss";

export default function ProjectCard({ side = "right", project }) {
  const { t } = useTranslation();
  const isRightSide = side === "right";

  return (
    <div className={`${isRightSide ? "project-card-right" : "project-card-left"} project-card`}>
      <h3>{project?.name ?? "Project name"}</h3>
      <p>{project?.description ? t(project.description) : "Project description"}</p>
      <div className="hashtags">
        <p>{project?.tags ?? "#Hashtags"}</p>
      </div>
    </div>
  );
}
