import * as THREE from "three";
import frag from "../shader/frag2.glsl?raw";
import vert from "../shader/vert2.glsl?raw";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes";
import { createNoise2D } from "simplex-noise";

export default class Metaball {
  resolution = 40;
  materials = {
    basic: new THREE.MeshBasicMaterial({
      color: 0x222288,
      wireframe: true,
    }),

    shader: new THREE.ShaderMaterial({
      uniforms: {
        uPixelRation: { value: this.resolution },
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uTime: { value: 1.0 },
        uColor: { value: new THREE.Color(0x42a9f1) },
        viewVector: { value: new THREE.Vector3(0, 0, 20) },
      },
      vertexShader: vert,
      fragmentShader: frag,
      side: THREE.DoubleSide,
      transparent: true,
      wireframe: false,
    }),
  };
  effectController = {
    material: "shader", // <= Material_Name
    speed: 1,
    numBlobs: 100, // 個数
    resolution: 40, // 細かさ
    isolation: 100, // 離れる 10~100
    // With/without floor or wall
    floor: false,
    wallx: false,
    wallz: false,
  };
  effect = new MarchingCubes(
    this.resolution,
    this.materials["basic"], //<= Material_Name
    true,
    true,
    100000
  );
  noise2D = createNoise2D();

  constructor(scene: THREE.Scene) {
    this.effect;
    this.effect.position.set(0, 0, 0);
    this.effect.enableUvs = false;
    this.effect.enableColors = false;

    scene.add(this.effect);
  }

  updateCubes(
    object: MarchingCubes,
    time: number,
    numblobs: number,
    floor: boolean,
    wallx: boolean,
    wallz: boolean
  ) {
    object.reset(); // Delete marching cubes

    const subtract = 6;
    const strength = 0.5 / ((Math.sqrt(numblobs) - 1) / 4 + 1);

    for (let i = 0; i < numblobs; i++) {
      // Postion Animation
      const ballx =
        0.5 +
        this.noise2D(i * 1.85 + time * 0.25, i * 1.85 + time * 0.25) * 0.25;
      const ballz =
        0.5 + this.noise2D(i * 1.9 + time * 0.25, i * 1.9 + time * 0.25) * 0.25;
      const bally =
        0.5 + this.noise2D(i * 1.8 + time * 0.25, i * 1.8 + time * 0.25) * 0.25;

      object.addBall(ballx, bally, ballz, strength, subtract);
      const mat = object.material as THREE.ShaderMaterial;
      mat.uniformsNeedUpdate = true;
    }

    if (floor) object.addPlaneY(2, 12);
    if (wallz) object.addPlaneZ(2, 12);
    if (wallx) object.addPlaneX(2, 12);

    object.update();
  }
}
