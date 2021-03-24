import "./App.css";
import drawingJson from "../src/constants/drawingJson.json";
import { getIn } from "timm";
import SeatsCanvasRenderer from "./canvas-renderer/index";
import MainStage from "./konva-canvas-renderer";
function App() {
  return (
    <div className="App">
      <MainStage />
    </div>
  );
}

export default App;
