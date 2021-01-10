import React from "react";
import { MeshLambertMaterial } from "three";

function Plane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]} receiveShadow>
      {/* <planeBufferGeometry attach="geometry" args={[100,100]} /> */}
      <planeGeometry attach="geometry" args={[1000, 1000, 32, 32]} />
      <MeshLambertMaterial
        attach="material"
        color={{color:"red"}}
      />
    </mesh>
  );
}

export default Plane;
