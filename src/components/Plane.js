import * as THREE from "three";
import React, { useRef, Suspense, useState } from "react";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import lerp from "lerp";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

// IMAGES
import images from "./images";

const Plane = ({ mouse }) => {
  const mesh = useRef();
  const ref = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  const projects = document.querySelector("ul");

  const [hovered, setHovered] = useState(false);

  if (projects) {
    projects.addEventListener("mouseover", mouseOver);
    projects.addEventListener("mouseleave", mouseOut);

    function mouseOver() {
      setHovered(true);
    }

    function mouseOut() {
      setHovered(false);
    }
  }

  useFrame(({ clock }) => {
    if (mesh.current) {
      ref.current.uTime = 0;
      mesh.current.position.x = lerp(
        mesh.current.position.x,
        mouse.current[0] / aspect,
        0.1
      );
      mesh.current.position.y = lerp(
        mesh.current.position.y,
        (mouse.current[1] / aspect) * -1,
        0.1
      );
      hovered
        ? (ref.current.uAlpha = lerp(ref.current.uAlpha, 1.0, 0.1))
        : (ref.current.uAlpha = lerp(ref.current.uAlpha, 0.0, 0.1));

      if (
        mesh.current.position.x <= mouse.current[0] / aspect - 1 ||
        (mesh.current.position.x >= mouse.current[0] / aspect + 1 &&
          mesh.current.position.y <= (mouse.current[1] ) / aspect - 1) ||
        mesh.current.position.y >= (mouse.current[1] ) / aspect + 1
      ) {
        ref.current.uNoiseAmp = lerp(
          ref.current.uNoiseAmp,
          0.02 + (mouse.current[0] * mouse.current[1] * -0.00002),
          0.1
        );
        ref.current.uNoiseFreq = lerp(
          ref.current.uNoiseFreq,
          0.3 + (mouse.current[0] * mouse.current[1] * 0.00005),
          0.1
        );
      } else {
        ref.current.uNoiseAmp = lerp(ref.current.uNoiseAmp, 0.0, 0.1);
        ref.current.uNoiseFreq = lerp(ref.current.uNoiseFreq, 0.0, 0.1);
      }
    }
  });

  const WaveShaderMaterial = shaderMaterial(
    // Uniform
    {
      uTime: 0,
      uColor: new THREE.Color(0.0, 0.0, 0.0),
      uTexture: new THREE.Texture(),
      uAlpha: 0,
      uNoiseFreq: 0.0,
      uNoiseAmp: 0.0,
    },
    // Vertex Shader
    glsl`
  precision mediump float;
  varying vec2 vUv;
  varying float vWave;
  uniform float uTime;
  uniform float uNoiseFreq;
  uniform float uNoiseAmp;
  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
  void main() {
    vUv = uv;
    vec3 pos = position;
    float noiseFreq = uNoiseFreq;
    float noiseAmp = uNoiseAmp;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
    pos.z += snoise3(noisePos) * noiseAmp;
    vWave = pos.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);  
  }
`,
    // Fragment Shader
    glsl`
  precision mediump float;
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uAlpha;
  uniform sampler2D uTexture;
  varying vec2 vUv;
  varying float vWave;
  void main() {
    float wave = vWave * 0.2;
    vec3 texture = texture2D(uTexture, vUv + wave).rgb;
    gl_FragColor = vec4(texture, uAlpha); 
  }
`
  );
  extend({ WaveShaderMaterial });

  const [image, setImage] = useState(images[0]);

  const [texture] = useLoader(THREE.TextureLoader, [image]);

  let links = document.querySelectorAll("li");

  links.forEach((link, idx) => {
    link.addEventListener("mouseover", () => {
      setImage(images[idx]);
    });
  });

  return (
    <>
      <mesh ref={mesh}>
        <planeBufferGeometry attach="geometry" args={[60, 90, 24, 24]} />
        <waveShaderMaterial
          ref={ref}
          attach="material"
          uTexture={texture}
          transparent={true}
        />
      </mesh>
    </>
  );
};

export default Plane;
