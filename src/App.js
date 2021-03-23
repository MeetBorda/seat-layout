import "./App.css";
import drawingJson from "../src/constants/drawingJson.json";
import { getIn } from "timm";
import SeatsCanvasRenderer from "./canvas-renderer/index";
function App() {
  return (
    <div className="App">
      <SeatsCanvasRenderer />
    </div>
  );
}

export default App;
