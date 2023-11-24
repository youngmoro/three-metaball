import { TrackballControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { MetaballGLSL } from "./MetaballGLSL";
import { MetaballThree } from "./MetaballThree";

function App() {
  return (
    <div className="App">
      <div>
        <img src="/vite.svg" className="logo" alt="Vite logo" />
        <img src="/react.svg" className="logo" alt="React logo" />
        <img src="/three.png" className="logo three" alt="Three logo" />
      </div>
      <h2>Metaballs with Marching Cubes</h2>
      <div className="canvas">
        <Canvas className="canvas">
          <TrackballControls />
          {/* <MetaballGLSL /> */}
          <MetaballThree />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
