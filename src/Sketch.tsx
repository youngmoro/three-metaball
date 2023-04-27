import { Environment } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import GUI from "lil-gui";
import React, { useEffect, useRef } from "react";
import Metaball from "./Metaball";

export const Sketch = () => {
  const { scene, camera } = useThree();

  const params = {
    numBall: 6,
    radius: 4,
    link: 4,
    color: [0.9, 0.8, 1],
    wireframe: false,
  };

  const guiRef = useRef<GUI>();
  const elementRef = useRef<Metaball>();

  useEffect(() => {
    camera.position.set(0, 0, -50);
    const gui = new GUI();
    gui
      .add(params, "numBall", 1, 10)
      .step(1)
      .onChange((v: number) => elementRef.current?.updateNumBall(v));
    gui
      .add(params, "radius", 0, 10)
      .onChange((v: number) => elementRef.current?.updateRadius(v));
    gui
      .add(params, "link", 0, 10)
      .onChange((v: number) => elementRef.current?.updateLink(v));
    gui
      .addColor(params, "color")
      .onChange((v: number[]) => elementRef.current?.updateColor(v));
    gui
      .add(params, "wireframe")
      .onChange((v: boolean) => elementRef.current?.updateWireframe(v));
    guiRef.current = gui;
    elementRef.current = new Metaball(scene);
  }, []);

  useFrame(() => {
    elementRef.current?.update();
  });

  return (
    <>
      <Environment preset="park" background={true} />
    </>
  );
};
