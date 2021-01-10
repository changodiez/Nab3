import React, { useState } from "react";

const Nav = (props) => {
  const [navClass, setNavClass] = useState(false);

  const settingNav = () => {
    setNavClass(!navClass);
  };

  const hidenav = () => {
    setNavClass(false);
  };

  let color = navClass ? "yellow" : "transparent"

  return (
    <div className="nav-content" style={{ backgroundColor: `${color}`}} >
      <nav
        onClick={() => settingNav()}
        className="nav"
        style={{ left: `${navClass ? -10 : -200}vw` }}
      >
        <div className="nav-links">
          <ul>
            <li>
              <a onClick={() => hidenav()} href="#Inicio">
                Collective
              </a>
            </li>
            <li>
              <a onClick={() => hidenav()} href="#Nosotros">
                About Us
              </a>
            </li>

            <li>
              <a onClick={() => hidenav()} href="#Servicios">
                Projects
              </a>
            </li>
            <li>
              <a onClick={() => hidenav()} href="#Contacto">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="toggle-btn" onClick={() => settingNav()}>
        <span className={navClass ? "abierto1" : "cerrado1"}></span>
        <span className={navClass ? "abierto1" : "cerrado2"}></span>
      </div>
    </div>
  );
};

export default Nav;
