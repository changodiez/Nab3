import React from "react";
import { Link } from "react-router-dom";
// glslify babel-plugin-glsl glsl-noise
// Install also glsl lint glsl literall


function Item({ title, link }) {
  return (
    
<Link to={`/${link}`} ><li><h2>{title}</h2></li></Link>
      
    
  );
}

export default Item;
