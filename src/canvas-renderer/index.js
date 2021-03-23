import React, { useState, useEffect, useRef } from "react";
import { setIn, getIn } from "timm";
import { transform, createCanvas } from "./transform";
import * as d3 from "d3-selection";
const SeatsCanvasRenderer = () => {
  const seatData = transform();
  const wrapperRef = useRef(null);
  const pickerRef = useRef(null);
  const pickerCanvas = pickerRef.current;
  const [center, setCenter] = useState(seatData.centerPoint);
  const [points, setPoints] = useState();
  const [seats, setSeats] = useState([]);
  const [pickerCtx, setPickerCtx] = useState();
  useEffect(() => {
    setSeats(seatData.seats);
    seatData.seats.map((seat) => draw(seat));
  }, []);

  const draw = (seat) => {
    const canvas = document.getElementById("canvasDom");
    const ctx = canvas.getContext("2d");
    const { coordinates, key, prefix, number } = seat;
    const x = coordinates.x - center.x + 20;
    const y = coordinates.y - center.y + 20;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(number, x, y + 5);
    console.log(x, y);
    const d3Canvas = d3
      .select(document.getElementById("canvasDom"))
      .on("click", () => select(ctx));
  };
  const select = (ctx) => {
    const { event } = d3;
    const { offsetX, offsetY } = event;
    ctx.beginPath();
    ctx.fillStyle = "#7B2D96";
    ctx.arc(offsetX, offsetY, 10, 0, 2 * Math.PI);
    ctx.fill();
    console.log(event);
  };
  return (
    <div>
      <>
        {seats.map((e) => {
          return (
            <>
              <div>{e.key}</div>
            </>
          );
        })}
      </>
      <div
        ref={wrapperRef}
        className="canvas-wrapper"
        style={{ position: "relative", zIndex: 0, width: 400, margin: "auto" }}
      >
        <canvas
          ref={pickerRef}
          id="pickerCanvas"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 0,
          }}
        />
        <canvas
          id="canvasDom"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            opacity: 1,
            zIndex: 5,
          }}
        />
      </div>
    </div>
  );
};

export default SeatsCanvasRenderer;
