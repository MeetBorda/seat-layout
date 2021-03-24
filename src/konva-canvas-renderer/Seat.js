import React, { Fragment } from "react";
import { Circle, Text } from "react-konva";
const TEXT_OFFSET = -5;

const Seat = (props) => {
  const { coordinates, name, number, select, deselect, status } = props;
  const { x, y } = coordinates;
  const currX = x;
  const currY = y;
  const [isSelected, setSelected] = React.useState(false);

  return status ? (
    <Fragment>
      <Text x={currX + TEXT_OFFSET} y={currY + TEXT_OFFSET} text={number} />
      <Circle
        x={currX}
        y={currY}
        radius={10}
        stroke={isSelected ? "blue" : "red"}
        strokeWidth={1}
        onClick={(e) => {
          setSelected(!isSelected);
          isSelected ? deselect(name) : select(name);
        }}
      />
    </Fragment>
  ) : null;
};

export default Seat;
