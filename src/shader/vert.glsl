precision highp float;

attribute float vertexId;

uniform sampler2D uTexture;
uniform float uLink;
uniform float uTime;
uniform vec3 uNumCell;
uniform vec3 uCellSize;
uniform vec3 uRandoms[NumBall];

varying vec3 vNormal;
varying float vDiscard;

const float PI = 3.1415926535897932384626433832795;
const float PI2 = PI * 2.0;
const vec3 AXIS_X = vec3(1.0, 0.0, 0.0);
const vec3 AXIS_Y = vec3(0.0, 1.0, 0.0);
const vec3 AXIS_Z = vec3(0.0, 0.0, 1.0);

vec3 rotateVec3(vec3 p, float angle, vec3 axis){
  vec3 a = normalize(axis);
  float s = sin(angle);
  float c = cos(angle);
  float r = 1.0 - c;
  mat3 m = mat3(
    a.x * a.x * r + c,
    a.y * a.x * r + a.z * s,
    a.z * a.x * r - a.y * s,
    a.x * a.y * r - a.z * s,
    a.y * a.y * r + c,
    a.z * a.y * r + a.x * s,
    a.x * a.z * r + a.y * s,
    a.y * a.z * r - a.x * s,
    a.z * a.z * r + c
  );
  return m * p;
}

// メタボールを動かす
float move(vec3 p, int i) {
  float theta = mod(uTime * 0.01, PI2);
  p = rotateVec3(p, theta, AXIS_Z);
  p = rotateVec3(p, theta, AXIS_X);

  float t = mod(uTime * 0.02 + uRandoms[i].z * 10.0, PI2);
  p -= uRandoms[i] * 20.0 * sin(t);

  float r = 7.0;

  return length(p) - r;
}

float opSmoothUnion(float d1, float d2) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / uLink, 0.0, 1.0);
  return mix(d2, d1, h) - uLink * h * (1.0 - h);
}

// 最終的な距離関数
float dist(vec3 p) {
  float result = 0.0;
  for(int i = 0; i < NumBall; i++) {
    float d = move(p, i);
    result = opSmoothUnion(result == 0.0 ? d : result, d);
  }
  return result;
}

vec3 getNormal(vec3 p) {
  return normalize(vec3(
    dist(p + AXIS_X) - dist(p - AXIS_X),
    dist(p + AXIS_Y) - dist(p - AXIS_Y),
    dist(p + AXIS_Z) - dist(p - AXIS_Z)
  ));
}

// v0, v1の値をもとにp0, p1を補間した値を返す
vec3 interpolate(vec3 p0, vec3 p1, float v0, float v1) {
  return mix(p0, p1, v0 / (v0 - v1));
}

// 論理和
int or(int a, int b) {
  int result = 0;
  int n = 1;
  for(int i = 0; i < 8; i++) {
    if ((mod(float(a), 2.) == 1.) || (mod(float(b), 2.) == 1.)) result += n;
    a = a / 2;
    b = b / 2;
    n = n * 2;
    if(!(a > 0 || b > 0)) break;
  }
  return result;
}

void main(){
  float cellId = floor(vertexId / 15.0); // セルのID
  float vertexIdInCell = mod(vertexId, 15.0); // セル内での頂点のID

  // セルの基準点を算出
  vec3 cellIndices = vec3(
    mod(cellId, uNumCell.x),
    mod(cellId, (uNumCell.x * uNumCell.y)) / uNumCell.x,
    cellId / (uNumCell.x * uNumCell.y)
  );
  cellIndices = floor(cellIndices);

  // セルの基準点 (立方体の向かって左下奥)
  vec3 c0 = (0.5 * uNumCell - cellIndices) * uCellSize;

  vec3 c1 = c0 + uCellSize * vec3(1.0, 0.0, 0.0);
  vec3 c2 = c0 + uCellSize * vec3(1.0, 0.0, 1.0);
  vec3 c3 = c0 + uCellSize * vec3(0.0, 0.0, 1.0);
  vec3 c4 = c0 + uCellSize * vec3(0.0, 1.0, 0.0);
  vec3 c5 = c0 + uCellSize * vec3(1.0, 1.0, 0.0);
  vec3 c6 = c0 + uCellSize * vec3(1.0, 1.0, 1.0);
  vec3 c7 = c0 + uCellSize * vec3(0.0, 1.0, 1.0);

  // ルックアップテーブルの参照

  // まずはポリゴンの張り方の256通りのうちどのパターンになるか調べる
  float cubeIndex = 0.0;
  cubeIndex = mix(cubeIndex, float(or(int(cubeIndex),   1)), 1.0 - step(0.0, dist(c0)));
  cubeIndex = mix(cubeIndex, float(or(int(cubeIndex),   2)), 1.0 - step(0.0, dist(c1)));
  cubeIndex = mix(cubeIndex, float(or(int(cubeIndex),   4)), 1.0 - step(0.0, dist(c2)));
  cubeIndex = mix(cubeIndex, float(or(int(cubeIndex),   8)), 1.0 - step(0.0, dist(c3)));
  cubeIndex = mix(cubeIndex, float(or(int(cubeIndex),  16)), 1.0 - step(0.0, dist(c4)));
  cubeIndex = mix(cubeIndex, float(or(int(cubeIndex),  32)), 1.0 - step(0.0, dist(c5)));
  cubeIndex = mix(cubeIndex, float(or(int(cubeIndex),  64)), 1.0 - step(0.0, dist(c6)));
  cubeIndex = mix(cubeIndex, float(or(int(cubeIndex), 128)), 1.0 - step(0.0, dist(c7)));

  // 続いて現在の頂点がどの辺上に配置されるかを調べる
  // つまり、ルックアップテーブルのどの値を参照するかのインデックスを求める
  float edgeIndex = texture2D(uTexture, vec2((cubeIndex * 16.0 + vertexIdInCell) / 4096.0, 0.0)).r * 255.0;
  vec3 pos = position;
  
  vDiscard = 0.0;
  if(edgeIndex == 255.0) {
    vDiscard = 1.0;
  } else if (edgeIndex == 0.0) {
    pos = interpolate(c0, c1, dist(c0), dist(c1));
  } else if (edgeIndex == 1.0) {
    pos = interpolate(c1, c2, dist(c1), dist(c2));
  } else if (edgeIndex == 2.0) {
    pos = interpolate(c2, c3, dist(c2), dist(c3));
  } else if (edgeIndex == 3.0) {
    pos = interpolate(c3, c0, dist(c3), dist(c0));
  } else if (edgeIndex == 4.0) {
    pos = interpolate(c4, c5, dist(c4), dist(c5));
  } else if (edgeIndex == 5.0) {
    pos = interpolate(c5, c6, dist(c5), dist(c6));
  } else if (edgeIndex == 6.0) {
    pos = interpolate(c6, c7, dist(c6), dist(c7));
  } else if (edgeIndex == 7.0) {
    pos = interpolate(c4, c7, dist(c4), dist(c7));
  } else if (edgeIndex == 8.0) {
    pos = interpolate(c0, c4, dist(c0), dist(c4));
  } else if (edgeIndex == 9.0) {
    pos = interpolate(c1, c5, dist(c1), dist(c5));
  } else if (edgeIndex == 10.0) {
    pos = interpolate(c2, c6, dist(c2), dist(c6));
  } else if (edgeIndex == 11.0) {
    pos = interpolate(c3, c7, dist(c3), dist(c7));
  }

  vNormal = getNormal(pos);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}