import { useFrame, useThree } from "@react-three/fiber";
import GUI from "lil-gui";
import React, { useEffect, useRef } from "react";
import Metaball from "./Metaball";
import { Environment } from "@react-three/drei";

export const MetaballThree = () => {
  const { scene, camera } = useThree();

  const elementRef = useRef<Metaball>();

  useEffect(() => {
    camera.position.set(0, 0, -1.5);
    elementRef.current = new Metaball(scene);
  }, []);

  let time = 0.0;
  useFrame((state, delta) => {
    if (!elementRef.current) return;

    const e = elementRef.current;
    const ec = e.effectController;
    let er = e.resolution;

    // marching cubes
    time += delta * ec.speed * 0.5;

    if (ec.resolution !== er) {
      er = ec.resolution;
      elementRef.current.effect.init(Math.floor(er));
    }

    if (ec.isolation !== e.effect.isolation) {
      e.effect.isolation = ec.isolation;
    }

    e.updateCubes(e.effect, time, ec.numBlobs, ec.floor, ec.wallx, ec.wallz);
  });

  return <Environment preset="park" background={true} />;
};
