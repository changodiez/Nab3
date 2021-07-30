import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import data from "../assets/data.json";

import Item from "./Item";

function Projects() {
  return (
    <>
    
      <div id="projects">
        <ul>
          {data.projects.map((project, index) => (
            <Item title={project.title} key={index} link={project.link}  />
          ))}
          
        </ul>
      </div>
      
      
    </>
  );
}

export default Projects;
