import * as THREE from "three";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
//R3F
import { Canvas, useFrame, extend, useThree } from "react-three-fiber";
// Deai - R3F
import { softShadows, useGLTFLoader, Loader, Html } from "drei";
//Effects
import { EffectComposer } from "./assets/postprocessing/EffectComposer.js";
import { ShaderPass } from "./assets/postprocessing/ShaderPass.js";
import { RenderPass } from "./assets/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "./assets/postprocessing/UnrealBloomPass.js";
import { FilmPass } from "./assets/postprocessing/FilmPass.js";
import { GlitchPass } from "./assets/effects/Glitchpass.js";
import { WaterPass } from "./assets/effects/Waterpass.js";
import lerp from "lerp";

// Styles
import "./App.scss";

import { Suspense } from "react";
import Lights from "./components/Lights";
import Nav from "./components/Nav.js";

// soft Shadows
softShadows();

// Makes these prototypes available as "native" jsx-string elements
extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  WaterPass,
  UnrealBloomPass,
  FilmPass,
  GlitchPass,
});

// Model

const Ball = (props) => {
  const gltf = useGLTFLoader("/PM_Baked_Idea_4-21-20_05.gltf", true);
  return <primitive object={gltf.scene} dispose={null} />;
};

const Model = ({ mouse }) => {
  const mesh = useRef();
  const rotY = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  useFrame(() => {
    rotY.current.rotation.y += 0.006;
    if (mesh.current) {
      mesh.current.position.x = lerp(
        mesh.current.position.x,
        mouse.current[0] / aspect / 20,
        0.1
      );
      mesh.current.rotation.x = lerp(
        mesh.current.rotation.x,
        0 + mouse.current[1] / aspect / 50,
        0.6
      );
      mesh.current.rotation.y = lerp(
        mesh.current.position.x,
        mouse.current[0] / aspect / 10,
        0.1
      );
    }
  });
  return (
    <>
      <group ref={rotY}>
        <pointLight distance={40} intensity={8} color="lightblue"></pointLight>
        <mesh ref={mesh} position={[0, -1.5, 0]} scale={[1.5, 1.5, 1.5]}>
          <Ball />
        </mesh>
      </group>
    </>
  );
};

function Swarm({ count, mouse }) {
  const mesh = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Generate some random positions, speed factors and timings
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.001 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      // There is no sense or reason to any of this, just messing around with trigonometric functions
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      particle.mx += (mouse.current[0] - particle.mx) * 0.01;
      particle.my += (mouse.current[1] * -1 - particle.my) * 0.01;
      // Update the dummy object
      dummy.position.set(
        (particle.mx / 10) * a +
          xFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b +
          yFactor +
          Math.sin((t / 10) * factor) +
          (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b +
          zFactor +
          Math.cos((t / 10) * factor) +
          (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      // And apply the matrix to the instanced item
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronBufferGeometry attach="geometry" args={[0.02, 0]} />
        <meshStandardMaterial attach="material" color="#050505" />
      </instancedMesh>
    </>
  );
}

//Effects

function Effect({ down }) {
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
    size,
  ]);
  useEffect(() => void composer.current.setSize(size.width, size.height), [
    size,
  ]);
  useFrame(() => composer.current.render(), 1);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <unrealBloomPass attachArray="passes" args={[aspect, 0.8, 0.2, 0]} />
      <filmPass attachArray="passes" args={[0.3, 0.4, 1500, false]} />
      <glitchPass attachArray="passes" factor={down ? 0.6 : 0} />
    </effectComposer>
  );
}

function MoveLigth({ count, mouse }) {
  const light = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  useFrame((state) => {
    light.current.position.set(
      mouse.current[0] / aspect,
      -mouse.current[1] / aspect,
      2
    );
  });
  return (
    <pointLight ref={light} distance={5} intensity={8} color="lightblue" />
  );
}

const App = () => {
  const [down, set] = useState(false);
  const mouse = useRef([300, -200]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );

  //   function glitch() {
  //     let togle = setInterval(glitcher, 4000  );

  //     function glitcher() {
  //    set(true)
  //    setTimeout(()=>set(false), 200)
  //    console.log(togle)
  // if(togle > 6) {
  // clearInterval(togle)
  // }
  //     }
  //   }

  // glitch()

  return (
    <>
      <Loader />
      <Canvas
        colorManagement
        shadowMap
        camera={{ fov: 20, position: [0, -1, 10] }}
        onMouseMove={onMouseMove}
        onMouseUp={() => set(false)}
        onMouseDown={() => set(true)}
      >
        <Suspense fallback={null}>
          <Html fullscreen>
            <Nav />
            <div className="container">
              <h1 className="title">Na.B3</h1>
            </div>
          </Html>
          <Lights />
          <Model mouse={mouse} />
          <Effect down={down} />
          <MoveLigth mouse={mouse} />
          <Swarm count={20000} mouse={mouse} />
        </Suspense>
      </Canvas>
    </>
  );
};

export default App;
