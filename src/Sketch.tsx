import { Sky } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import GUI from "lil-gui";
import React, { useEffect, useRef, useState } from "react";
import Metaball from "./Metaball";

export const Sketch = () => {
  const { scene } = useThree();
  const [radius, setRadius] = useState(1);

  const params = {
    size: radius,
  };

  const guiRef = useRef<GUI>();
  const elementRef = useRef<Metaball>();

  useEffect(() => {
    elementRef.current?.update(radius);
    const gui = new GUI();
    gui
      .add(params, "size", 1, 10)
      .onChange((value: number) => setRadius(value));
    guiRef.current = gui;
    elementRef.current = new Metaball(scene, radius);
  }, []);

  useEffect(() => {
    elementRef.current?.update(radius);
  }, [radius]);

  // const geo = new THREE.SphereGeometry(radius);
  // const mat = new THREE.MeshBasicMaterial({
  //   color: 0xff00ff,
  //   wireframe: true,
  // });

  return (
    <>
      <Sky />
      {/* <mesh> */}
      {/* <sphereGeometry /> */}
      {/* <meshStandardMaterial wireframe={true} /> */}
      {/* </mesh> */}
      {/* <mesh geometry={geo} material={mat} /> */}
    </>
  );
};
