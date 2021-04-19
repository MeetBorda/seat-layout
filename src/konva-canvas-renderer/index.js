import React, { useState } from "react"
import Konva from "konva"

import Row from "./Row"
import logo from "./loader.gif"
const MAX_SEATS = 21
const SEAT_LENGTH = 22
const SRMC = true
const xL = true

const TEXT_OFFSET = -5
let lastDist = 0
let lastCenter = 0

let hasDrawed = false
let xOff = 0
let yOff = 0

let selectedSeats = {}

const RIGHT_THRESHOLD = 1900
const LEFT_THRESHOLD = 270

let firstLeftOut = 0
let firstRightOut = 0

const throttle = (func, limit) => {
  let inThrottle
  return (...args) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = setTimeout(() => (inThrottle = false), limit)
    }
  }
}

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

function getCenter(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }
}

const MainStage = (props) => {
  const seatData = props.data || { seats: [], svgs: [] }
  let selectedSeats = []

  const [useView, setView] = useState({ x: 0, y: 0 })

  const seatBgLayerRef = React.useRef(null)
  const staticLayerRef = React.useRef(null)
  const seatTextLayerRef = React.useRef(null)
  const stageRef2 = React.useRef(null)
  const staticSeatRowTextLayerRef = React.useRef(null)
  const rectGroupRef = React.useRef(null)

  const calculateWidth = () => {
    if (!SRMC) {
      const lastR = seatData[seatData.length - 1]
      const l = lastR.seats.length
      const coor = lastR.seats[l - 1].coordinates.x
      return coor
    } else return 0
  }

  const handleSelect = (name, pos) => {
    selectedSeats.push(name)
    props.setSeats(selectedSeats)
  }
  const handleDeselect = (name, pos) => {
    selectedSeats.splice(selectedSeats.indexOf(name), 1)
    props.setSeats(selectedSeats)
  }

  const setStickyRowTextOnDrag = (xDragMove) => {
    staticSeatRowTextLayerRef.current.position({
      x: xDragMove / stageRef2.current.scaleX(),
    })
    staticSeatRowTextLayerRef.current.batchDraw()
  }

  const handleCanvasDraw = () => {
    Konva.hitOnDragEnabled = true

    const throttledSetStickyRowTextOnDrag = throttle(
      setStickyRowTextOnDrag,
      300
    )

    stageRef2.current = new Konva.Stage({
      container: "container",
      width: window.innerWidth,
      height: window.innerHeight,
      draggable: true,
      dragBoundFunc: (pos) => {
        let newX = pos.x

        const isLeftOut = window.innerWidth - pos.x < 200
        const isRightOut = Math.abs(pos.x) > 1077

        // better logic to be implemented //

        if (isLeftOut) {
          firstLeftOut = firstLeftOut || pos.x
          newX = firstLeftOut
        }

        if (isRightOut) {
          firstRightOut = firstRightOut || pos.x
          newX = firstRightOut
        }

        return {
          x: newX,
          y: pos.y,
        }
      },
    })

    seatBgLayerRef.current = new Konva.Layer()
    staticLayerRef.current = new Konva.Layer()
    staticSeatRowTextLayerRef.current = new Konva.Layer()

    staticLayerRef.current.listening(false)
    staticSeatRowTextLayerRef.current.listening(false)

    const stage = stageRef2.current
    const seatBgLayer = seatBgLayerRef.current

    const staticLayer = staticLayerRef.current
    const staticSeatRowTextLayer = staticSeatRowTextLayerRef.current

    stage.add(staticLayer)
    stage.add(seatBgLayer)

    stage.add(staticSeatRowTextLayer)
    drawChildren()
    staticLayer.draw()
    seatBgLayer.draw()
    staticSeatRowTextLayer.draw()

    stageRef2.current.on("wheel", (e) => {
      e.evt.preventDefault()
    })

    stage.on("touchmove", function (e) {
      e.evt.preventDefault()

      const touch1 = e.evt.touches[0]
      const touch2 = e.evt.touches[1]

      if (touch1 && touch2) {
        e.evt.cancelBubble = true
        // if the stage was under Konva's drag&drop
        // we need to stop it, and implement our own pan logic with two pointers
        if (stage.isDragging()) {
          stage.stopDrag()
        }

        const p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        }
        const p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        }

        if (!lastCenter) {
          lastCenter = getCenter(p1, p2)
          return
        }
        const newCenter = getCenter(p1, p2)

        const dist = getDistance(p1, p2)

        if (!lastDist) {
          lastDist = dist
        }

        // local coordinates of center point
        const pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        }

        const scale = stage.scaleX() * (dist / lastDist)

        stage.scaleX(scale)
        stage.scaleY(scale)

        // calculate new position of the stage
        const dx = newCenter.x - lastCenter.x
        const dy = newCenter.y - lastCenter.y

        const newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        }

        stage.position(newPos)
        stage.batchDraw()

        lastDist = dist
        lastCenter = newCenter
        setStickyRowTextOnDrag(-stageRef2.current.x())
      } else {
        setStickyRowTextOnDrag(-stageRef2.current.x())
      }
    })

    stage.on("touchend", function () {
      lastDist = 0
      lastCenter = null
    })

    stage.on("dragend", function (e) {
      const isLeftOut = e.target.x() + LEFT_THRESHOLD > window.innerWidth
      const isRightOut = Math.abs(e.target.x()) > RIGHT_THRESHOLD

      if (isLeftOut) {
        stage.position({ x: -150 })
        setStickyRowTextOnDrag(150)
      }

      if (isRightOut) {
        stage.position({ x: -(RIGHT_THRESHOLD - window.innerWidth) })
        setStickyRowTextOnDrag(RIGHT_THRESHOLD - window.innerWidth)
      }
    })

    hasDrawed = true
  }

  const drawChildren = () => {
    const seatBgLayer = seatBgLayerRef.current
    const staticLayer = staticLayerRef.current

    const staticSeatRowTextLayer = staticSeatRowTextLayerRef.current

    console.log("drawing", seatData)
    if (seatData.categories.length > 0) {
      seatData.svgs.forEach((svg, i) => {
        const pathNew = new Konva.Path({
          x: svg.centerPoint.x,
          y: svg.centerPoint.y,
          data: svg.d,
          fill: svg.fill,
        })
        staticLayer.add(pathNew)
      })

      const xGroup = new Konva.Group({
        name: "rect-seat-holder-group",
        x: 0,
        y: 0,
      })

      rectGroupRef.current = xGroup

      //   const konvaTextRect = new Konva.Rect({
      //     x: 0,
      //     y: 0,
      //     fill: "red",
      //     height: window.innerHeight,
      //     width: 20,
      //     opacity: 0.5,
      //   })

      // seatData.rowsNames.forEach((rowName) => {
      //   if (rowName.name) {
      //     const rowNameText = new Konva.Text({
      //       x: rowName.coordinates.x,
      //       y: rowName.coordinates.y - 2,
      //       text: rowName.name,
      //       fontSize: 10,
      //       perfectDrawEnabled: false,
      //       zIndex: 10,
      //     });

      //     xGroup.add(rowNameText);
      //   }
      // });

      //   xGroup.add(konvaTextRect)
      staticSeatRowTextLayer.add(xGroup)

      seatData.categories.forEach((cat, index) => {
        if (cat.category === "SVG") {
          return
        }
        const categoryGroup = new Konva.Group({ name: cat.category })

        const catText = new Konva.Text({
          x: cat.seats[0].seats[0].coordinates.x + 40,
          y: cat.seats[0].seats[0].coordinates.y - 40,
          text: cat.category,
          fontSize: 10,
          perfectDrawEnabled: false,
        })

        staticLayer.add(catText)

        categoryGroup.on("click tap", (e) => {
          var t0 = performance.now()

          if (e.target.getType() !== "Stage") {
            categoryGroup.clearCache()
            // selectedSeats
            console.log(e.target.x())
            const [obj1, obj2] = e.target.parent.children
            const { seatProps, isSelectedSeat } = obj1.attrs

            obj1.setAttr("isSelectedSeat", !isSelectedSeat)

            //   add logic for isFilled
            obj1.fill(!isSelectedSeat ? "blue" : "transparent").draw()
            obj2.fill(!isSelectedSeat ? "white" : "black").draw()
            //

            props.setSeats(seatProps)

            categoryGroup.cache()
            var t1 = performance.now()
            console.log(
              "Call to doSomething took " + (t1 - t0) + " milliseconds."
            )
          }
        })

        cat.seats.forEach((seatRow, i) => {
          const { seats, row } = seatRow
          const currX = seats[0].coordinates.x //
          const currY = seats[0].coordinates.y //
          const rowText = new Konva.Text({
            x: currX - 25,
            y: currY - 5,
            text: row,
            fontSize: 10,
            perfectDrawEnabled: false,
          })
          staticLayer.add(rowText)

          seats.forEach((seat, seatIndex) => {
            const seatGroup = new Konva.Group()

            const { coordinates, number, name } = seat

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
              seatProps: { ...seat, isSelectedSeat: false },
            })

            const seatText = new Konva.Text({
              x: coordinates.x - 4,
              y: coordinates.y - 4,
              text: number,
              fontSize: 10,
              perfectDrawEnabled: false,
            })

            seatGroup.add(seatRect).add(seatText)
            categoryGroup.add(seatGroup)

            seatBgLayer.add(categoryGroup)
          })
        })
        categoryGroup.cache()
      })
    }
  }

  React.useEffect(() => {
    if (props.data.categories.length > 0 && !hasDrawed) {
      handleCanvasDraw()
    }
  }, [props.data])

  console.log(props.data)

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
        minWidth: "100vw",
      }}
    >
      <div id="container" />
    </div>
  )
}

export default MainStage
