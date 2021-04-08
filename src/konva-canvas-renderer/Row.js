import React, { memo, Fragment, useEffect } from "react"
import { Circle, Text, Group } from "react-konva"
import Seat from "./Seat"
const SEAT_SIZE = 22

const Row = memo((props) => {
  const { i, row, centerPoint, seats, select, deselect, useView } = props

  const currX = seats[0].coordinates.x //
  const currY = seats[0].coordinates.y //
  return (
    <>
      <Text x={currX - SEAT_SIZE} y={currY - 5} text={`${row}`} />
      {seats.map((seat, i) => {
        // const isOut = i > (window.innerWidth + useView.x) / 25 + 15
        // if (isOut) return
        return (
          <>
            <Seat
              key={`${seat.coordinates.x}_${i}`}
              {...seat}
              startPoint={currX}
              centerPoint={centerPoint}
              select={select}
              deselect={deselect}
            />
          </>
        )
      })}
    </>
  )
})

export default Row
