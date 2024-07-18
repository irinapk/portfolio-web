import ChiliIcon from '../assets/images/pepper_icon.svg';

export default function TopBar() {

  const menuList = [
    {name: "Home", position: "about-me"},
    {name: "Skills", position: "skills"},
    {name: "Projects", position: "projects"},
    {name: "Blog", position: "personal-blog"},
    {name: "Contact", position: "contact-me"},
  ];

  function moveTo(id) {
    if (id === "about-me") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.getElementById(id).scrollIntoView({behavior: 'smooth'});
    }
  }

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