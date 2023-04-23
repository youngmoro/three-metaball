import * as THREE from "three";
import frag from "./shader/frag.glsl?raw";
import vert from "./shader/vert.glsl?raw";

export default class Metaball {
  scene: THREE.Scene;
  mesh: THREE.Mesh;
  geo: THREE.SphereGeometry;
  mat: THREE.ShaderMaterial;

  constructor(scene: THREE.Scene, radius: number) {
    this.geo = new THREE.SphereGeometry(radius);
    this.mat = new THREE.ShaderMaterial({
      fragmentShader: frag,
      vertexShader: vert,
      uniforms: {
        uColor: { value: new THREE.Color("#d0ffff") },
      },
      wireframe: true,
    });
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.scene = scene;
    this.scene.add(this.mesh);
  }

  update(newRadius: number) {
    this.scene.remove(this.mesh);
    this.geo = new THREE.SphereGeometry(newRadius);
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.scene.add(this.mesh);
  }
}
