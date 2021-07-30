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

const Ball = (props) => {
  const gltf = useGLTF("/trash.gltf");
  return <primitive object={gltf.scene} dispose={null} />;
};

const Model = ({ mouse }) => {
  const mesh = useRef();
  const rotY = useRef();
/*   const { size, viewport } = useThree(); */
/*   const aspect = size.width / viewport.width; */

  useFrame(() => {
    rotY.current.rotation.y += 0.0006;

     /* if (mesh.current) {
        rotY.current.position.x = lerp(
          rotY.current.position.x,
          mouse.current[0] / aspect / 10,
          0.0001
        );
        rotY.current.rotation.x = lerp(
          rotY.current.rotation.x,
         mouse.current[1] / aspect / 50,
          0.0005
        );
        rotY.current.rotation.y = lerp(
          rotY.current.position.x,
          mouse.current[0] / aspect / 10,
          0.0001
        );
      }; */
  });
  return (
    <>
      <group ref={rotY}>
        <mesh ref={mesh} position={[0, -0.5, 0]} scale={[13, 13, 13]}>
          <Ball />
          <pointLight
            distance={60}
            intensity={10}
            color="lightblue"
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
    rotY.current.rotation.y += 0.006;
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
    <pointLight ref={light} distance={100} intensity={15} color="lightblue" />
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
      <Suspense fallback={<Loader />}>
        <Canvas
          concurrent
          colorManagement
          camera={{ position: [0, 0, 120], fov: 70 }}
        >
           <fog attach="fog" args={['#075EA9ed', 400, 700]} />
          {/*  <Particles count={1000} mouse={mouse} /> */}
          <Lights />
          <MoveLigth mouse={mouse} />

          <Home
            domContent={domContent}
            bgColor="#000000"
            position={250}
            mouse={mouse}
          >
            <span className="title">Na.B3</span>
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
