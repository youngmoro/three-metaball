precision highp float;

uniform vec3 sphereColor;

varying vec3 vNormal;
varying float vDiscard;

const vec3 LIGHT_DIR = normalize(vec3(1.0, 1.0, 1.0));

void main(void) {
  if (vDiscard == 1.0) {
    discard;
  } else {
    vec3 normal = normalize(vNormal);

    vec3 color = sphereColor * max(0.0, dot(LIGHT_DIR, normal));
    gl_FragColor = vec4(color, 1.0);
  }
}