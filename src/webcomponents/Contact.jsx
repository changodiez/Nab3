import React from "react";

function Contact() {
  return (
    <>
      {/* <span style={{ color: "black" }}>Contacto</span> */}
      <section id="contacto" className="contacto">
        <div className="div-vacio1"></div>
        <div className="general">
          <a href="mailto:na.b3collective@gmail.com">
            <h3 className="mail">na.b3collective@gmail.com</h3>
          </a>
        </div>
        <div className="studio">
          <h3>Taller - Studio</h3>
          <h3 className="grey">Carrer de la Verneda 19 - Nave 3</h3>
          <h3 className="grey">08018</h3>
          <h3 className="grey">Barcelona</h3>
        </div>
        <div className="div-vacio2"></div>
        <div className="social bottom">
          <h3>Social</h3>
          <a href="https://www.instagram.com/na.b3collective/">
            <h3 className="grey">Instagram</h3>
          </a>
        </div>
        <div className="div-vacio2"></div>
        <footer>
          <div className="createdby bottom">
            <h3 className="grey collabostudio">
              Created by{" "}
              <a href="https://www.collabo.studio/">Collabo Studio</a>
            </h3>
          </div>
          <div className="allrights bottom">
            <h3 className="grey">2020 - All rights reserved</h3>
          </div>
        </footer>
      </section>
    </>
  );
}

export default Contact;
