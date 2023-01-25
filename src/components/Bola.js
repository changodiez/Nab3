import * as THREE from "three";
import React, { useRef, useState, useEffect } from "react";
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
      ref.current.uTime += 0.001;


    
       mesh.current.position.x = lerp(
        mesh.current.position.x,
        mouse.current[0] / 100000,
        0.01
      );
      mesh.current.position.y = lerp(
        mesh.current.position.y,
        (mouse.current[1] / 100000) * -1,
        0.01
      );

      

    
      let distancia, x1, x2, y1, y2;

    x1 = mesh.current.position.x
    x2 =  mouse.current[0] / aspect
    y1 = mesh.current.position.y
    y2 = mouse.current[1] / aspect 
    distancia=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
   
      if (
        (distancia + 10) >= 0
      ) {

     

        ref.current.uNoiseAmp = lerp(
          ref.current.uNoiseAmp,
          0.5 + distancia * distancia  * 0.00002,
          0.1
        );
        ref.current.uNoiseFreq = lerp(
          ref.current.uNoiseFreq,
          0.5  + distancia * distancia * 0.00003,
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
      uAlpha: 1,
      uNoiseFreq: 0.2,
      uNoiseAmp: 0.5,
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
  void main() {
    float wave = vWave * 0.1;
    vec3 texture = texture2D(uTexture, vUv + wave).rgb;
    gl_FragColor = vec4(texture, uAlpha); 
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
    )
}


 

export default Bola;
