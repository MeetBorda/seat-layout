import React, { Fragment } from "react"
import { Circle, Text } from "react-konva"
const TEXT_OFFSET = -5

const Seat = (props) => {
  const {
    coordinates,
    name,
    number,
    select,
    deselect,
    status,
    toggleSelect,
  } = props
  const { x, y } = coordinates
  const currX = x
  const currY = y
  const [isSelected, setSelected] = React.useState(false)
  const seatRef = React.useRef(null)

  React.useEffect(() => {
    // seatRef.current.cache()
  }, [])

  return status ? (
    <Fragment>
      {/* {isSelected ? null : (
        <Text
          x={currX + TEXT_OFFSET}
          y={currY + TEXT_OFFSET}
          fill={isSelected ? "white" : "green"}
          text={number}
          listening={false}
        />
      )} */}
      <Circle
        perfectDrawEnabled={false}
        x={currX}
        y={currY}
        radius={10}
        fill={isSelected ? "green" : null}
        stroke={isSelected ? "white" : "green"}
        strokeWidth={1}
        ref={seatRef}
        onTap={(e) => {
          //   console.log(seatRef.current.clearCache())
          seatRef.current.clearCache()

          console.log(e.target.clearCache)
          setSelected(!isSelected)
          toggleSelect(isSelected, name)

          seatRef.current.cache()
        }}
      />
      {/* {isSelected ? (
        <Text
          x={currX + TEXT_OFFSET}
          y={currY + TEXT_OFFSET}
          fill="white"
          text={number}
          listening={false}
        />
      ) : null} */}
    </Fragment>
  ) : null
}

export default Seat
