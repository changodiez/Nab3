import * as THREE from "three";
import React, { useRef } from "react";
import { extend, useFrame, useLoader, useThree } from "@react-three/fiber";
import lerp from "lerp";
import { shaderMaterial } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

// IMAGES
import goldi from "../assets/images/goldi.jpg";

const Bola = ({ mouse }) => {
  const mesh = useRef();
  const ref = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  useFrame(({ clock }) => {
    if (mesh.current) {
      let distancia, x1, x2, y1, y2;

      x1 = mesh.current.position.x;
      x2 = mouse.current[0] / aspect;
      y1 = mesh.current.position.y;
      y2 = (mouse.current[1] / aspect) * -1;
      distancia = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

      ref.current.uTime += 0.003 * +distancia * 0.01;

      ref.current.rotation = lerp(
        ref.current.rotation,
       mouse.current[1] / aspect / 3,
        0.1
      );
      mesh.current.rotation.x = lerp(
        mesh.current.rotation.x,
        mouse.current[0] / 100000,
        0.05
      );

      mesh.current.position.y = lerp(
        mesh.current.position.y,
        (mouse.current[1] / 100000) * -1,
        0.05
      );

      if (distancia + 10 >= 0) {
        ref.current.uNoiseAmp = lerp(
          ref.current.uNoiseAmp,
          0.5 + distancia * distancia * 0.00002,
          0.1
        );
        ref.current.uNoiseFreq = lerp(
          ref.current.uNoiseFreq,
          0.5 + distancia * distancia * 0.00003,
          0.1
        );
      } else {
        ref.current.uNoiseAmp = lerp(ref.current.uNoiseAmp, 0.0, 0.1);
        ref.current.uNoiseFreq = lerp(ref.current.uNoiseFreq, 0.0, 0.1);
      }
      ref.current.uPos = mesh.current.position
    }
  });

  const WaveShaderMaterial = shaderMaterial(
    // Uniform
    {
      uTime: 1,
      uColor: new THREE.Color(0.0, 0.0, 0.0),
      uTexture: new THREE.Texture(),
      uAlpha: 1,
      uNoiseFreq: 0.2,
      uNoiseAmp: 0.5,
    },
    // Vertex Shader
    glsl`
  precision mediump float;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vWave;
  uniform float uTime;
  uniform float uNoiseFreq;
  uniform float uNoiseAmp;
  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
  void main() {
    vUv = uv;
    vNormal = normal;
    vec3 pos = position;
    float noiseFreq = uNoiseFreq;
    float noiseAmp = uNoiseAmp;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y  * noiseFreq + uTime, pos.z  * noiseFreq + uTime);
    pos.z += snoise3(noisePos) * noiseAmp;
    vWave = pos.x;
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
  varying vec3 vNormal;
  void main() {
    float wave = vWave * 0.1;
     vec3 normal=vNormal;
    float diffuse = dot(normal, vec3 (1.));
    vec4 texture = texture2D(uTexture, vUv + wave);
    gl_FragColor = texture * diffuse; 
   // gl_FragColor = vec4(diffuse); 
  }
`
  );
  extend({ WaveShaderMaterial });

  const texture1 = useLoader(THREE.TextureLoader, goldi);

  return (
    <>
      <mesh
        scale={[0.31, 0.31, 0.31]}
        ref={mesh}
        visible // object gets render if true
        castShadow // Sets whether or not the object cats a shadow
        // There are many more props.....
      >
        {/* A spherical shape*/}
        <sphereGeometry attach="geometry" args={[1, 64, 32]} />

        <waveShaderMaterial
          ref={ref}
          attach="material"
          uTexture={texture1}
          castShadow
        />
     
      </mesh>
    </>
  );
};

export default Bola;
