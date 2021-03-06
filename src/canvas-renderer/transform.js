import newProject from "../constants/newProject.json";
import curved from "../constants/curved.json";
import category from "../constants/curvedSeats+normal=category.json";
import random from "../constants/random.json";
import largeLayout from "../constants/largeLayout.json";
import xlargeLayout from "../constants/xlargeLayout.json";
import xLarge from "../constants/xLarge.json";
import eye from "../constants/eye.json";

export const transform = (file) => {
  const { shapes } = eye;
  let seats = [];
  shapes.forEach((e, i) => {
    const { centerPoint, makeData, dumbSeatsList } = e;
    const transformedSeats = makeSeats(makeData, dumbSeatsList, true);
    seats.push({
      isCurved: i === 1 || i === 0 || i === 2 ? true : false,
      seats: transformedSeats,
      centerPoint: centerPoint,
      row: transformedSeats[0].prefix,
    });
  });

  return seats;
};

export const makeSeats = (makeData, dumbSeatsList, socialDistancing) => {
  const extract = makeData.rows.length ? makeData.rows[0] : null;

  const madeSeat = extract.map((e, i) => {
    const { number, prefix, x, y } = e;
    return {
      name: `${prefix}-${number}`,
      coordinates: { x, y },
      number,
      prefix,
      status: dumbSeatsList.includes(number)
        ? 0
        : socialDistancing
        ? i % 2 == 0
          ? 1
          : 0
        : 1,
    };
  });
  return madeSeat;
};
