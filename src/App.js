import * as THREE from "three";
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { Suspense } from "react";
import { Route, Switch } from "react-router-dom";

//R3F
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";

// Deai - R3F
import { softShadows, useGLTF, Html, Loader } from "@react-three/drei";

//Effects
import { EffectComposer } from "./assets/postprocessing/EffectComposer.js";
import { ShaderPass } from "./assets/postprocessing/ShaderPass.js";
import { RenderPass } from "./assets/postprocessing/RenderPass.js";
import { FilmPass } from "./assets/postprocessing/FilmPass.js";
import { GlitchPass } from "./assets/effects/Glitchpass.js";
import { WaterPass } from "./assets/effects/Waterpass.js";
import lerp from "lerp";

// Web components
import Contact from "./webcomponents/Contact";
import About from "./webcomponents/About";
import Projects from "./webcomponents/Projects.jsx";
import Page from "./pages/Page";

// Styles
import "./App.scss";

import Lights from "./components/Lights";
import Plane from "./components/Plane.js";
import Bola from "./components/Bola.js";

// Scroll
import { Section } from "./components/section";
import state from "./components/state";
import { useInView } from "react-intersection-observer";


// soft Shadows
softShadows();

// Makes these prototypes available as "native" jsx-string elements
extend({
  EffectComposer,
  ShaderPass,
  RenderPass,
  WaterPass,
  FilmPass,
  GlitchPass,
});

// Model

/* const Ball = (props) => {
  const gltf = useGLTF("/trash.gltf");
  return <primitive object={gltf.scene} dispose={null} />;
}; */

const Model = ({ mouse }) => {
  const mesh = useRef();
  const rotY = useRef();

  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  useFrame(() => {
    /* rotY.current.rotation.y += 0.0006; */

    if (mesh.current) {

      if(mesh.current.rotation.x < 1) {
        rotY.current.rotation.x = lerp(
          rotY.current.rotation.x,
         mouse.current[1] / aspect / 300,
          0.1
        );
      }

      if(mesh.current.rotation.y < 1) {
        rotY.current.rotation.y = lerp(
          rotY.current.position.y,
          mouse.current[0] / aspect / 300,
          0.1
        );
      }
      /*   rotY.current.position.x = lerp(
          rotY.current.position.x,
          mouse.current[0] / aspect / 10,
          0.0001
        ); */
        
       
      };

        //TEXTURES 


 
  
  });
  return (
    <>
      <group ref={rotY}>
        <mesh ref={mesh} position={[0, 1.5, 0]} scale={[13, 13, 13]}>
          <Bola mouse={mouse} /> 
          <meshStandardMaterial
          attach="material" // How the element should attach itself to its parent
          color="#7222D3" // The color of the material
          transparent // Defines whether this material is transparent. This has an effect on rendering as transparent objects need special treatment and are rendered after non-transparent objects. When set to true, the extent to which the material is transparent is controlled by setting it's .opacity property.
          roughness={0.1} // The roughness of the material - Defaults to 1
          metalness={0.1} // The metalness of the material - Defaults to 0
        />
          <pointLight
            distance={60}
            intensity={10}
            color="pink"
          ></pointLight>
      
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
      const a = Math.cos(t) + Math.sin(t * 1) / 100;
      const b = Math.sin(t) + Math.cos(t * 2) / 100;
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
        <dodecahedronBufferGeometry attach="geometry" args={[0.4, 0]} />
        <meshStandardMaterial attach="material" color="#050505" />
      </instancedMesh>
    </>
  );
}

const Home = ({ domContent, children, bgColor, position, mouse }) => {
  const mesh = useRef();
  const rotY = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  let scale;
  if (size.width < 600) {
    scale = 8.5;
  } else {
    scale = size.width / 150;
  }

  useFrame(() => {
    
    if (mesh.current) {
      mesh.current.position.x = lerp(
        mesh.current.position.x,
        mouse.current[0] / aspect / 20,
        0.9
      );
      mesh.current.rotation.x = lerp(
        mesh.current.rotation.x,
        0 + mouse.current[1] / aspect / -10,
        0.4
      );
      mesh.current.rotation.y = lerp(
        mesh.current.position.x,
        mouse.current[0] / aspect / 10,
        0.2
      );
    }
  });

  const [refItem, inView] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [inView]);
  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, position, 0]}>
        <mesh ref={rotY} position={[0, -10, 0]} scale={[scale, scale, scale]}>
          <Model mouse={mouse} />
          <Swarm mouse={mouse} count={500} />
        </mesh>
        <Html fullscreen portal={domContent}>
          <div ref={refItem} className="container">
            <h1 className="title">{children}</h1>
          </div>
        </Html>
      </group>
    </Section>
  );
};

const HTMLContent = ({ domContent, children, bgColor, position }) => {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y += 0.01));
  const [refItem, inView] = useInView({
    threshold: 0,
  });
  useEffect(() => {
    inView && (document.body.style.background = bgColor);
  }, [inView]);
  return (
    <Section factor={1.5} offset={1}>
      <group position={[0, position, 0]}>
        <mesh ref={ref} position={[0, -35, 0]} scale={[100, 100, 100]}></mesh>
        <Html fullscreen portal={domContent}>
          <div ref={refItem}>
            <div>{children}</div>
          </div>
        </Html>
      </group>
    </Section>
  );
};

//Effects

function Effect({ down }) {
  const composer = useRef();
  const { scene, gl, size, camera } = useThree();

  useEffect(
    () => void composer.current.setSize(size.width, size.height),
    [size]
  );
  useFrame(() => composer.current.render(), 1);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />
      <filmPass attachArray="passes" args={[0.3, 0.4, 1500, false]} />
      <glitchPass attachArray="passes" factor={down ? 0.6 : 0} />
    </effectComposer>
  );
}

//Ligh with mouse

function MoveLigth({ mouse }) {
  const light = useRef();
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  useFrame((state) => {
    light.current.position.set(
      mouse.current[0] / aspect,
      -mouse.current[1] / aspect,
      50
    );
  });

  return (
    <pointLight ref={light} distance={100} intensity={15} color="pink" />
  );
}

const Scene = () => {
  const [down, set] = useState(false);
  const mouse = useRef([300, -200]);
  const domContent = useRef();

  const scrollArea = useRef();
  const onScroll = (e) => (state.top.current = e.target.scrollTop);
  useEffect(() => void onScroll({ target: scrollArea.current }), []);

  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) =>
      (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]),
    []
  );

  // RANDOM GLITCH

  const [randomTimer, setRandomTimer] = useState(3000);

  const generate = () => {
    let num = randomIntFromInterval(50, 300);
    set(2);
    const switcher = () => {
      set(false);
    };
    setTimeout(switcher, num);
    let numTimer = randomIntFromInterval(6000, 15000);
    setRandomTimer(numTimer);
  };

  function randomIntFromInterval(min, max) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  useEffect(() => {
    setTimeout(generate, randomTimer);
  }, [randomTimer]);

  // hover sobre projects

  return (
    <>
    <div id="contenedor">
      <Loader />
      <Suspense fallback={null}>
        <Canvas
          concurrent
          colorManagement
          camera={{ position: [0, 0, 120], fov: 70 }}
        >
          <fog attach="fog" args={[
"rgba(94,169,237,1)", 400, 700]} />
          <Lights />
          <MoveLigth mouse={mouse} />

          <Home
            domContent={domContent}
            bgColor="#0c0301"
            position={250}
            mouse={mouse}
          >
           <svg className="logo-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.02 140.2"><g id="Capa_2" data-name="Capa 2"><g id="Capa_1-2" data-name="Capa 1"><path d="M18.72,140.2H44.28a15.3,15.3,0,0,0,4.48-.59,5.38,5.38,0,0,0,2.94-2.09,7.17,7.17,0,0,0,1.06-4.2q0-4.06-2.29-5.32a12.86,12.86,0,0,0-6.19-1.26H18.72Z"/><polygon points="49.09 0 27.47 0 49.09 52.34 49.09 0"/><polygon points="101.13 43.9 113.83 43.9 107.57 26.39 107.39 26.39 101.13 43.9"/><path d="M70.51,77.89h-22a39.92,39.92,0,0,1,12.87,2,20.46,20.46,0,0,1,9.48,6.39q3.57,4.4,3.57,11.65a19.43,19.43,0,0,1-1.65,8.2,16,16,0,0,1-4.57,5.93,17.61,17.61,0,0,1-6.71,3.32,20.47,20.47,0,0,1,6.38,1.94,16.12,16.12,0,0,1,5,3.9,17.32,17.32,0,0,1,3.31,6.08,27.71,27.71,0,0,1,1.17,8.48,26.34,26.34,0,0,1-.4,4.43h35.43a17.63,17.63,0,0,0,4.83-.59,5.84,5.84,0,0,0,3.19-2.09,6.81,6.81,0,0,0,1.13-4.2q0-4.06-2.47-5.32a14.8,14.8,0,0,0-6.68-1.26H100.54V108.37h11.72a14.22,14.22,0,0,0,4.12-.53A4.79,4.79,0,0,0,119,106a6.34,6.34,0,0,0,.94-3.69q0-3.56-2-4.58a13.1,13.1,0,0,0-5.68-1H81.33V77.89Z"/><polygon points="70.51 50.06 70.51 60.38 95.39 0 70.51 0 70.51 22.43 70.51 50.06"/><path d="M50.44,106a6.76,6.76,0,0,0,.87-3.69q0-3.56-1.89-4.58a11.4,11.4,0,0,0-5.27-1H18.72v11.68H44.15a12.23,12.23,0,0,0,3.82-.53A4.45,4.45,0,0,0,50.44,106Z"/><polygon points="119.45 0 141.01 52.34 141.01 0 119.45 0"/><path d="M121.64,64.11H93.31L88.2,77.89h28.73a46.28,46.28,0,0,1,13.9,2A22.16,22.16,0,0,1,141,86.24V77.89H126.7Z"/><polygon points="19.31 23.59 19.31 64.11 0 64.11 0 77.89 41.4 77.89 19.31 23.59"/><path d="M138.19,112.05a19.56,19.56,0,0,1-7.23,3.32,23.37,23.37,0,0,1,6.88,1.94,18.07,18.07,0,0,1,3.18,1.9v-9.83A15.93,15.93,0,0,1,138.19,112.05Z"/></g></g></svg>
          </Home>
          <HTMLContent
            domContent={domContent}
            bgColor="#E5E7E9"
            position={0}
            mouse={mouse}
          >
            <About />
          </HTMLContent>

          <HTMLContent
            domContent={domContent}
            bgColor="#F4F6F7"
            position={-250}
            mouse={mouse}
          >
            <Projects />
          </HTMLContent>
          <HTMLContent
            domContent={domContent}
            bgColor="#ffffff"
            position={-500}
            mouse={mouse}
          >
            <Contact />
          </HTMLContent>
          <Plane mouse={mouse} />
          <Effect down={down} />
        </Canvas>
      </Suspense>
      <div
        className="scrollArea"
        id="c"
        ref={scrollArea}
        onScroll={onScroll}
        onPointerOut={() => set(false)}
        onPointerMove={onMouseMove}
        onPointerUp={() => set(false)}
        onPointerDown={() => set(true)}
      >
        <div style={{ position: "sticky", top: 0 }} ref={domContent} />
        <div style={{ height: `${state.pages * 100}vh`, width: "100%" }} />
      </div>
      </div>
    </>
  );
};

function App() {
  return (
    <>
      <Switch>
        <Route path="/" exact={true} render={(props) => <Scene />} />

        <Route
          path="/:id"
          exact={true}
          render={(props) => <Page {...props} />}
        />
      </Switch>
    </>
  );
}

export default App;
