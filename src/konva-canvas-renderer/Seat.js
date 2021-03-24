import React, { Fragment } from "react";
import { Circle, Text } from "react-konva";

const Seat = (props) => {
  // console.log(x,y,isSelected,data.name,getAbsolutePosition(),.getStage.container(),;
  const {
    coordinates,
    name,
    number,
    prefix,
    centerPoint,
    select,
    deselect,
    isSelected,
    curveFactor,
    seats,
  } = props;
  const { x, y } = coordinates;

  const currX = x - centerPoint.x + 20 + 200;
  const currY = y - centerPoint.y + 20 + 20;
  return (
    <Fragment>
      <Text x={currX - 5} y={currY - 5} text={number} />
      <Circle
        x={currX}
        y={currY}
        radius="10"
        stroke={isSelected ? "blue" : "red"}
        strokeWidth={1}
        onClick={(e) => {
          console.log(e);
          isSelected
            ? deselect(name, e.target.getAbsolutePosition())
            : select(name, e.target.getAbsolutePosition());
        }}
      />
    </Fragment>
  );
};

export default Seat;
