import { TrackballControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Sketch } from "./Sketch";

function App() {
  return (
    <div className="App">
      <div>
        <img src="/vite.svg" className="logo" alt="Vite logo" />
        <img src="/react.svg" className="logo react" alt="React logo" />
        <img src="/three.png" className="logo" alt="Three logo" />
        <h2>Vite + React + Three</h2>
      </div>
      <div className="canvas">
        <Canvas className="canvas">
          <Sketch />
          <TrackballControls />
        </Canvas>
      </div>
    </div>
  );
}

export default App;
