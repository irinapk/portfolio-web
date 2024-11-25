import ChiliIcon from '../assets/images/pepper_icon.svg';
import {useLocation, useNavigate} from "react-router";
import {useEffect} from "react";

export default function TopBar() {

  const navigate = useNavigate();
  const {pathname, state: locationState} = useLocation();

  const menuList = [
    {name: "Home", position: "about-me"},
    {name: "Skills", position: "skills"},
    {name: "Projects", position: "projects"},
    // {name: "Blog", position: "personal-blog"},
    {name: "Contact", position: "contact-me"},
  ];

  function moveTo(id) {
    if (pathname !== "/") {
      navigate("/", {state: {id}})
    } else {
      if (id === "about-me") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.getElementById(id).scrollIntoView({behavior: 'smooth'});
      }
    }
  }

  useEffect(() => {
    if (locationState?.id && pathname === "/") {
      document.getElementById(locationState.id).scrollIntoView({behavior: 'smooth'});
    }
  }, [pathname])

  return (
    <nav className="navigation-bar">
      <ChiliIcon />
      <ul className="nav-menu">
        {menuList.map((m) => (
          <li key={m.name} onClick={() => moveTo(m.position)}>{m.name}</li>
        ))}
      </ul>
  </nav>
  )
}