import React from 'react'

const Lights = () => {


    return (
        <>
        <ambientLight intensity={1} />
        <directionalLight castShadow 
        position={[-5, -5, -8]} 
        intensity={0.6} />
        <directionalLight position={[0, 80, 0]} intensity={0.1}/>
        <spotLight position={[5, -1, -8]}  intensity={0.6} color={"cian"}/>

            
        </>
    )
}

export default Lights
