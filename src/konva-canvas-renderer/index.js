import React, { Fragment, memo, useState } from "react";
import { Stage, Layer, FastLayer, Text, Circle } from "react-konva";
import Konva from "konva";

import Row from "./Row";
import logo from "./loader.gif";
const MAX_SEATS = 21;
const SEAT_LENGTH = 22;
const SRMC = true;
const xL = true;

const TEXT_OFFSET = -5;
let lastDist = 0;
let lastCenter = 0;

let hasDrawed = false;
let xOff = 0;
let yOff = 0;

let selectedSeats = {};

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getCenter(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  };
}

const MainStage = memo(
  (props) => {
    const seatData = props.data || { seats: [], svgs: [] };
    let selectedSeats = [];
    console.log(seatData);
    const stageRef = React.useRef(null);
    const [useView, setView] = useState({ x: 0, y: 0 });

    const seatBgLayerRef = React.useRef(null);
    const staticLayerRef = React.useRef(null);
    const seatTextLayerRef = React.useRef(null);
    const stageRef2 = React.useRef(null);

    const selectedSeatsRef = React.useRef({});

    const calculateWidth = () => {
      if (!SRMC) {
        const lastR = seatData[seatData.length - 1];
        const l = lastR.seats.length;
        const coor = lastR.seats[l - 1].coordinates.x;
        return coor;
      } else return 0;
    };

    const handleSelect = (name, pos) => {
      selectedSeats.push(name);
      props.setSeats(selectedSeats);
    };
    const handleDeselect = (name, pos) => {
      selectedSeats.splice(selectedSeats.indexOf(name), 1);
      props.setSeats(selectedSeats);
    };

    const handleCanvasDraw = () => {
      Konva.hitOnDragEnabled = true;

      stageRef2.current = new Konva.Stage({
        container: "container",
        width: window.innerWidth,
        height: window.innerHeight,
        draggable: true,
      });

      seatBgLayerRef.current = new Konva.Layer();
      staticLayerRef.current = new Konva.Layer();
      seatTextLayerRef.current = new Konva.Layer();
      staticLayerRef.current.listening(false);

      const stage = stageRef2.current;
      const seatBgLayer = seatBgLayerRef.current;
      const seatTextLayer = seatTextLayerRef.current;
      const staticLayer = staticLayerRef.current;

      stage.add(staticLayer);
      stage.add(seatBgLayer);
      stage.add(seatTextLayer);
      drawChildren();
      staticLayer.draw();
      seatBgLayer.draw();

      stage.on("touchmove", function (e) {
        e.evt.preventDefault();
        var touch1 = e.evt.touches[0];
        var touch2 = e.evt.touches[1];

        if (touch1 && touch2) {
          // if the stage was under Konva's drag&drop
          // we need to stop it, and implement our own pan logic with two pointers
          if (stage.isDragging()) {
            stage.stopDrag();
          }

          var p1 = {
            x: touch1.clientX,
            y: touch1.clientY,
          };
          var p2 = {
            x: touch2.clientX,
            y: touch2.clientY,
          };

          if (!lastCenter) {
            lastCenter = getCenter(p1, p2);
            return;
          }
          var newCenter = getCenter(p1, p2);

          var dist = getDistance(p1, p2);

          if (!lastDist) {
            lastDist = dist;
          }

          // local coordinates of center point
          var pointTo = {
            x: (newCenter.x - stage.x()) / stage.scaleX(),
            y: (newCenter.y - stage.y()) / stage.scaleX(),
          };

          var scale = stage.scaleX() * (dist / lastDist);

          stage.scaleX(scale);
          stage.scaleY(scale);

          // calculate new position of the stage
          var dx = newCenter.x - lastCenter.x;
          var dy = newCenter.y - lastCenter.y;

          var newPos = {
            x: newCenter.x - pointTo.x * scale + dx,
            y: newCenter.y - pointTo.y * scale + dy,
          };

          stage.position(newPos);
          stage.batchDraw();

          lastDist = dist;
          lastCenter = newCenter;
        }
      });

      stage.on("touchend", function () {
        lastDist = 0;
        lastCenter = null;
      });

      stage.on("dragend", function (e) {});

      hasDrawed = true;
    };

    const drawChildren = () => {
      const stage = stageRef2.current;
      const seatBgLayer = seatBgLayerRef.current;
      const staticLayer = staticLayerRef.current;
      //  const seatTextLayer = seatTextLayerRef.current;

      console.log("drawing", seatData);
      if (seatData.categories.length > 0) {
        seatData.svgs.forEach((svg, i) => {
          const pathNew = new Konva.Path({
            x: svg.centerPoint.x,
            y: svg.centerPoint.y,
            data: svg.d,
            fill: svg.fill,
          });
          staticLayer.add(pathNew);
        });
        seatData.categories.forEach((cat, index) => {
          const categoryGroup = new Konva.Group({ name: cat.category });

          const catText = new Konva.Text({
            x: cat.seats[0].seats[0].coordinates.x + 40,
            y: cat.seats[0].seats[0].coordinates.y - 40,
            text: cat.category,
            fontSize: 10,
            perfectDrawEnabled: false,
          });
          categoryGroup.add(catText);
          categoryGroup.on("click tap", (e) => {
            var t0 = performance.now();

            // clearCacheExtensively();
            categoryGroup.clearCache();
            console.log(e.target.parent);
            console.log(e.target.parent.children.isCached());
            if (e.target.getType() !== "Stage") {
              categoryGroup.clearCache();
              // selectedSeats
              const [obj1, obj2] = e.target.parent.children;
              console.log(obj1, obj2);
              //   add logic for isFilled
              obj1.fill("blue").draw();
              obj2.fill("white").draw();
            

              categoryGroup.cache();
              var t1 = performance.now();
              console.log(
                "Call to doSomething took " + (t1 - t0) + " milliseconds."
              );
            }
          });
          cat.seats.forEach((seatRow, i) => {
            const { seats, row } = seatRow;

            const currX = seats[0].coordinates.x; //
            const currY = seats[0].coordinates.y; //

            seats.forEach((seat, seatIndex) => {
              const seatGroup = new Konva.Group();

              const { coordinates, number, name } = seat;
              const seatRect = new Konva.Circle({
                x: Math.floor(coordinates.x),
                y: Math.floor(coordinates.y),
                width: 20,
                height: 20,
                stroke: "green",
                fill: "transparent",
                strokeWidth: 0.5,
                cornerRadius: 3,
                perfectDrawEnabled: false,
                name: `seat-rect-${coordinates.x}-${coordinates.y}`,
                seatProps: seat,
              });

              const seatText = new Konva.Text({
                x: coordinates.x - 4,
                y: coordinates.y - 4,
                text: number,
                fontSize: 10,
                perfectDrawEnabled: false,
              });

              seatGroup.add(seatRect).add(seatText);
              categoryGroup.add(seatGroup);
              //  seatTextLayer.add(seatText);

              seatBgLayer.add(categoryGroup);
            });
          });
          categoryGroup.cache();
        });
      }
    };

    const clearCacheExtensively = () => {
      const canvasLayerElements = stageRef2.current.getLayers();
      for (let i = 0; i < canvasLayerElements.length; i += 1) {
        const cachedCanvases = canvasLayerElements[i]._cache.get("canvas");
        if (cachedCanvases) {
          cachedCanvases.scene._canvas.width = 0;
          cachedCanvases.scene._canvas.height = 0;
          cachedCanvases.hit._canvas.width = 0;
          cachedCanvases.hit._canvas.height = 0;
          cachedCanvases.filter._canvas.width = 0;
          cachedCanvases.filter._canvas.height = 0;
          canvasLayerElements[i].clearCache();
        }
      }
    };

    React.useEffect(() => {
      // if (props.data.length > 0 && !hasDrawed) {
      //   handleCanvasDraw();
      // }
      if (props.data.categories.length > 0 && !hasDrawed) {
        handleCanvasDraw();
      }
    }, [props.data]);

    return (
      <div
        style={{
          display: "flex",
          position: "relative",
          backgroundColor: "white",
          position: "relative",
          width: "max-content",
          margin: "auto",
          border: "1px solid",
        }}
      >
        <div id="container" />
      </div>
    );
  },
  (a, b) => {
    return a.data === b.data;
  }
);

export default MainStage;
