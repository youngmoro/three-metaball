import { Canvas } from "@react-three/fiber";
import "./App.css";

function App() {
  return (
    <div className="App">
      <div>
        <img src="/vite.svg" className="logo" alt="Vite logo" />
        <img src="/react.svg" className="logo react" alt="React logo" />
        <img src="/three.png" className="logo" alt="Three logo" />
        <h2>Vite + React + Three Canvas</h2>
      </div>
      <div className="canvas">
        <Canvas></Canvas>
      </div>
    </div>
  );
}

export default App;
