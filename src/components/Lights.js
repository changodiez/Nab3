import React from "react";

const Lights = () => {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight castShadow position={[-50, -50, -180]} intensity={1} color={"red"} />
      <directionalLight position={[0, 80, 0]} intensity={1} />
      <spotLight position={[50, -1, -8]} intensity={1} color={"cyan"} />
    </>
  );
};

export default Lights;
