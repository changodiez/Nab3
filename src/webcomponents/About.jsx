import React from "react";

function About() {
  let w = window.innerWidth;
  let h = window.innerHeight;

  let mobile = false;

  if (w < 600) {
    mobile = true;
  }

  return (
    <div id={mobile ? "about-mobile" : "about"}>
      <div className={mobile ? "display-none" : "text-container"}>
        <p className="texto-about">
          Colectivo multidisciplinar que aborda las prácticas de investigación,
          experimentación y creación. Con interés en la articulación entre arte,
          ciencia, cuerpo y tecnología.{" "}
        </p>
      </div>
      <div className="text-container">
        <h3>
          El individuo puesto en un espacio distinto se cuestiona la realidad de
          lo que percibe.
        </h3>
      </div>
      <div className={mobile ? "textonta-container" : "display-none" }>
        <p className="texto-about">
          Colectivo multidisciplinar que aborda las prácticas de investigación,
          experimentación y creación. Con interés en la articulación entre arte,
          ciencia, cuerpo y tecnología.{" "}
        </p>
      </div>
    </div>
  );
}

export default About;
