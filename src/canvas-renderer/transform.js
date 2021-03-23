import newProject from "../constants/newProject.json";
export const transform = () => {
  const { shapes } = newProject;
  let seats = {};
  shapes.forEach((e) => {
    const { centerPoint, makeData } = e;
    const transformedSeats = makeSeats(makeData);
    seats = { seats: transformedSeats, centerPoint };
  });

  return seats;
};

export const makeSeats = (makeData) => {
  const extract = [];
  for (let i = 0; i < makeData.rows.length; i++) {
    extract.push(makeData.rows[i][0]);
  }
  const madeSeat = extract.map((e) => {
    const { number, prefix, x, y } = e;
    return {
      key: `${prefix}-${number}`,
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
