import React from "react";

import instagram from "../assets/instagram.png"

function Contact() {
  return (
    <>
      <section id="contacto" className="contacto">
        <div className="contact-containar">
          <a href="mailto:na.b3collective@gmail.com">
            <h3 className="mail">hello@nab3.es</h3>
          </a>
        </div>
        <div className="contact-containar">
          <h3>Taller - Studio</h3>
          <h3 className="grey">Carrer de la Verneda 19 - Nave 3</h3>
          <h3 className="grey">08018</h3>
          <h3 className="grey">Barcelona</h3>
        </div>
        <div className="contact-containar">
                 <a href="https://www.instagram.com/na.b3collective/">
            <img id="instagram-logo" src={instagram} alt="" />
          </a>
        </div>
      </section>
    </>
  );
}

export default Contact;
