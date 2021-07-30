import React from "react";
import { useParams, Link } from "react-router-dom";

import data from "../assets/data.json";

function Page() {
  let params = useParams().id;

  let pag;

  if (data) {
    pag = data.projects.find((project) => project.link === `${params}`);
  }

  let w = window.innerWidth;
  let h = window.innerHeight;

  let mobile = false;

  if (w < 600) {
    mobile = true
  }

  return (
    <div id={mobile ? "page-mobile" : "page"}>
      <nav>
        <Link to="/">Volver</Link>
      </nav>
      <div className="info">
        <div className= "hero">
          <div className="hero-left">
            <div className="title">{pag.title} </div>
            <div className="comentario">{pag.comentario}</div>
          </div>
          <img
            className="hero-image"
            src={require(`../assets/images/${pag.link}/${pag.images[0]}.jpg`)}
            alt=""
          />
        </div>
        <div className="description">
          <p>{pag.description}</p>
        </div>
        {pag.video ? (
          <div className="video-container">
            <iframe
              className="video"
              title="vimeo-player"
              src={pag.video}
              width={w}
              height= {mobile ? "100%" : h}
                           frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        ) : null}
       
        <div className="galeria">
          {pag.images.slice(1).map((image, key) => (
            <div class="contenedor-modal">
              <img
                src={require(`../assets/images/${pag.link}/${image}.jpg`)}
                alt={key}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
