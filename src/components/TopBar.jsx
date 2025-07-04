import ChiliIcon from '../assets/images/pepper_icon.svg';
import MenuIcon from '../assets/images/icons/menu.svg';
import CloseIcon from '../assets/images/icons/menu-close.svg';
import {useLocation, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export default function TopBar() {

  const navigate = useNavigate();
  const {pathname, state: locationState} = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const menuList = [
    {name: "Home", position: "about-me"},
    {name: "Skills", position: "skills"},
    {name: "Projects", position: "projects"},
    // {name: "Blog", position: "personal-blog"},
    {name: "Contact", position: "contact-me"},
  ];

  function moveTo(id, behavior = "smooth") {
    if (pathname !== "/") {
      navigate("/", {state: {id}})
    } else {
      if (id === "about-me") {
        window.scrollTo({ top: 0, behavior: behavior });
      } else {
        document.getElementById(id).scrollIntoView({block: "start", behavior: behavior});
      }
    }
  }

  function toggleMenu() {
    const mobileMenu = document.querySelector(".nav-menu-mobile");
    mobileMenu.classList.toggle("open-menu");
    menuOpen ? mobileMenu.classList.add("close-menu") : mobileMenu.classList.remove("close-menu");
    setMenuOpen(prevState => !prevState);
  }

  useEffect(() => {
    if (locationState?.id && pathname === "/") {
      moveTo(locationState.id, "auto");
    }
  }, [pathname])

  useEffect(() => {
    function checkSize() {
      if (window.innerWidth >= 700) {
        const mobileMenu = document.querySelector(".nav-menu-mobile");
        mobileMenu.classList.remove("close-menu");
      }
    }
    window.addEventListener('resize', checkSize)
    return () => {
      window.removeEventListener('resize', checkSize)
    }
  }, []);

  return (
    <nav className="navigation-bar">
      <ChiliIcon />
      <ul className="nav-menu">
        {menuList.map((m) => (
          <li key={m.name} onClick={() => moveTo(m.position)}>{m.name}</li>
        ))}
      </ul>

      {!menuOpen &&
        <button type="button" className="mobile-menu-btn" onClick={toggleMenu}>
          <MenuIcon  style={{width: 30, height: 40}}/>
        </button>
      }
      <div className="nav-menu-mobile">
        <button type="button" className="nav-menu-close-btn" onClick={toggleMenu}>
          <CloseIcon style={{width: 16}}/>
        </button>
        <ul>
          {menuList.map((m) => (
            <li key={m.name} onClick={() => {
              moveTo(m.position);
              toggleMenu();
            }}>{m.name}</li>
          ))}
        </ul>
      </div>
  </nav>
  )
}