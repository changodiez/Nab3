import React from "react";
import { useParams } from "react-router-dom";

// glslify babel-plugin-glsl glsl-noise
// Install also glsl lint glsl literall

import data from "../assets/data.json"

function Page() {

let params = useParams().id

console.log(params)

  return (
    <>
      <nav>Esto es un nav</nav>
      <div>title</div>
      <div>description</div>
      
    </>
  );
}

export default Page;