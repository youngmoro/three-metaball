import { Sky } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import GUI from "lil-gui";
import React, { useEffect, useRef, useState } from "react";
import Metaball from "./Metaball";

export const Sketch = () => {
  const { scene, camera } = useThree();
  const [radius, setRadius] = useState(1);

  const params = {
    size: radius,
  };

  const guiRef = useRef<GUI>();
  const elementRef = useRef<Metaball>();

  useEffect(() => {
    camera.position.set(0, 0, -50);
    // elementRef.current?.update(radius);
    const gui = new GUI();
    gui.add(params, "size", 0, 4).onChange((value: number) => setRadius(value));
    guiRef.current = gui;
    elementRef.current = new Metaball(scene);
  }, []);

  useFrame(() => {
    elementRef.current?.update();
  });
  // useEffect(() => {
  //   elementRef.current?.update();
  // }, [radius]);

  return (
    <>
      <Sky />
    </>
  );
};
