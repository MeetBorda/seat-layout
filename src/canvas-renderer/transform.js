import newProject from "../constants/newProject.json";
import p3 from "../constants/p3.json";
export const transform = () => {
  const { shapes } = p3;
  let seats = [];
  shapes.forEach((e, i) => {
    const { centerPoint, makeData } = e;
    const transformedSeats = makeSeats(makeData);
    seats.push({ seats: transformedSeats, centerPoint: centerPoint, row: i });
  });

  return seats;
};

export const makeSeats = (makeData) => {
  const extract = makeData.rows[0];

  const madeSeat = extract.map((e) => {
    const { number, prefix, x, y } = e;
    return {
      name: `${prefix}-${number}`,
      coordinates: { x, y },
      number,
      prefix,
    };
  });
  return madeSeat;
};

export const createCanvas = (_mainCanvas, _w, _h, _ratio) => {
  const mainCanvas = _mainCanvas;
  const w = _w;
  const h = _h;
  let ratio = _ratio;

  mainCanvas.width = w * ratio;
  mainCanvas.height = h * ratio;
  mainCanvas.style.width = `${w}px`;
  mainCanvas.style.height = `${h}px`;
  mainCanvas.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);

  return mainCanvas;
};
