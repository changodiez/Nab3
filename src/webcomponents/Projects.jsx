import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// glslify babel-plugin-glsl glsl-noise
// Install also glsl lint glsl literall
import data from "../assets/data.json";

import Item from "./Item";

data.projects.map((project, index) => console.log(project.title));

function Projects() {
  return (
    <>
    <Router>
      <div id="projects">
        <ul>
          {data.projects.map((project, index) => (
            <Item title={project.title} key={index} link={project.link}  />
          ))}
          
        </ul>
      </div>
      </Router>
    </>
  );
}

export default Projects;
