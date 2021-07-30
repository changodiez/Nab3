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

  return (
    <div id="page">
      <nav>
        <Link to="/">Volver</Link>
      </nav>
      <div className="info">
        <div className="hero">
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
              height={h}
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        ) : null}
       
        <div className="galeria">
          {pag.images.slice(1).map((image, index) => (
            <div class="contenedor-modal">
              <img
                src={require(`../assets/images/${pag.link}/${image}.jpg`)}
                alt={index}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Page;
