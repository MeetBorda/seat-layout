import newProject from "../constants/newProject.json";
import curved from "../constants/curved.json";
import category from "../constants/curvedSeats+normal=category.json";
import random from "../constants/random.json";
import largeLayout from "../constants/largeLayout.json";
import xlargeLayout from "../constants/xlargeLayout.json";
import xLarge from "../constants/xLarge.json";
import eye from "../constants/eye.json";
import icon from "../constants/icon.json";
import manyIcons from "../constants/manyIcons.json";
import master from "../constants/master.json";
import palm from "../constants/palm.json";
import exotic from "../constants/exotic.json";
const ROW_THRESHOLD = 5;
export const transform = (file) => {
  const { shapes } = exotic;
  let rows = [];
  let svgs = [];
  let categories = [];
  let rects = [];
  let texts = [];
  let group = shapes.reduce((r, a) => {
    r[a.TAG] = [...(r[a.TAG] || []), a];
    return r;
  }, {});
  const arr = Object.keys(group);
  // console.log(group);
  arr.forEach((e, i) => {
    if (e === "TEXT") {
      return;
    }
    group[e].forEach((el, id) => {
      const {
        centerPoint,
        makeData,
        dumbSeatsList,
        svgPath = undefined,
        TAG,
      } = el;
      if (e === "rect") {
        const { startX, startY, selectionBounds } = el;
        rects.push({ startX, startY, selectionBounds, centerPoint });
      } else if (e === "TXT") {
        const { textStr, selectionBounds, rotationRadians = 0 } = el;
        texts.push({ textStr, selectionBounds, centerPoint, rotationRadians });
      } else if (e === "SVG") {
        if (svgPath) {
          svgPath.centerPoint = centerPoint;
          svgs.push(svgPath);
        }
      } else if (makeData) {
        const transformedSeats = makeSeats(makeData, dumbSeatsList, false);
        //    console.log(el, id);
        rows.push({
          seats: transformedSeats,
          centerPoint: centerPoint,
          row: transformedSeats[0].prefix,
        });
      } else {
      //  console.log("unsupported", e);
      }
    });
    // let counter = 0;
     let newOb = { rows: rows, category: e };
    // //console.log(rows);
    // rows.map((_, i) => {
    //   if (counter % ROW_THRESHOLD === 0) {
    //     // console.log(
    //     //   counter,
    //     //   i + ROW_THRESHOLD,
    //     //   rows.slice(counter, i + ROW_THRESHOLD)
    //     // );
    //     categories.push({
    //       category: e + "-" + i / ROW_THRESHOLD,
    //       rows: rows.slice(counter, i + ROW_THRESHOLD),
    //     });
    //   }
    //   counter++;
    // });
    // counter = 0;
      categories.push(newOb);
    // console.log(categories);
    // console.log(seats);
    rows = [];
  });
  // arr.forEach((element, index) => {
  //   console.log(arr,group, element, index);
  //   const groupRows = group[element];
  //   groupRows.forEach((e, i) => {
  //     const {
  //       centerPoint,
  //       makeData,
  //       dumbSeatsList,
  //       svgPath = undefined,
  //       TAG,
  //     } = e;
  //     if (svgPath) {
  //       svgPath.centerPoint = centerPoint;
  //       svgs.push(svgPath);
  //     }

  //     if (makeData) {
  //       const transformedSeats = makeSeats(makeData, dumbSeatsList, true);

  //       seats.push({
  //         isCurved: i === 1 || i === 0 || i === 2 ? true : false,
  //         seats: transformedSeats,
  //         centerPoint: centerPoint,
  //         row: transformedSeats[0].prefix,
  //       });
  //     }
  //   });
  //   const newOb = {};
  //   newOb[element] = { seats: seats };

  //   categories.push(newOb);
  //   console.log(categories);
  //   console.log(seats);
  //   seats = [];
  // });

  // shapes.forEach((e, i) => {
  //   const {
  //     centerPoint,
  //     makeData,
  //     dumbSeatsList,
  //     svgPath = undefined,
  //     TAG,
  //   } = e;
  //   if (svgPath) {
  //     svgPath.centerPoint = centerPoint;
  //     svgs.push(svgPath);
  //   }

  //   if (makeData) {
  //     const transformedSeats = makeSeats(makeData, dumbSeatsList, true);

  //     seats.push({
  //       isCurved: i === 1 || i === 0 || i === 2 ? true : false,
  //       seats: transformedSeats,
  //       centerPoint: centerPoint,
  //       row: transformedSeats[0].prefix,
  //     });
  //   }
  // });

  return { categories, svgs, rects, texts };
};

export const makeSeats = (makeData, dumbSeatsList, socialDistancing) => {
  const extract = makeData.rows ? makeData.rows[0] : makeData;
  if (extract) {
    const madeSeat = extract.map((e, i) => {
      const { number, prefix, x, y } = e;
      return {
        name: `${prefix}-${number}`,
        coordinates: { x, y },
        number,
        prefix,
        status: 0,
      };
    });
    return madeSeat;
  }
};
