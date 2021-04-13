import React, { Fragment, memo, useState } from "react"
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

let debouncedCacheClear
let debouncedCache
let debouncedRedraw

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

function getCenter(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2,
  }
}

let cacheExists = false

// Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.
function throttle(func, wait, options) {
  var context, args, result
  var timeout = null
  var previous = 0
  if (!options) options = {}
  var later = function () {
    previous = options.leading === false ? 0 : Date.now()
    timeout = null
    result = func.apply(context, args)
    if (!timeout) context = args = null
  }
  return function () {
    var now = Date.now()
    if (!previous && options.leading === false) previous = now
    var remaining = wait - (now - previous)
    context = this
    args = arguments
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      result = func.apply(context, args)
      if (!timeout) context = args = null
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining)
    }
    return result
  }
}

function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    if (!timer) {
      func.apply(this, args)
    }
    clearTimeout(timer)
    timer = setTimeout(() => {
      timer = undefined
    }, timeout)
  }
}

const MainStage = memo(
  (props) => {
    const seatData = props.data || [
      {
        isCurved: true,
        seats: [
          {
            name: "A-1",
            coordinates: {
              x: 404,
              y: 159.5,
            },
            number: 1,
            prefix: "A",
            status: 1,
          },
          {
            name: "A-2",
            coordinates: {
              x: 407.9357744382115,
              y: 190.6961368424079,
            },
            number: 2,
            prefix: "A",
            status: 0,
          },
          {
            name: "A-3",
            coordinates: {
              x: 420.08988870705474,
              y: 219.67798099307538,
            },
            number: 3,
            prefix: "A",
            status: 1,
          },
          {
            name: "A-4",
            coordinates: {
              x: 439.5157681853846,
              y: 244.40462063562433,
            },
            number: 4,
            prefix: "A",
            status: 0,
          },
          {
            name: "A-5",
            coordinates: {
              x: 464.1033284629693,
              y: 264.05115217603156,
            },
            number: 5,
            prefix: "A",
            status: 1,
          },
          {
            name: "A-6",
            coordinates: {
              x: 491.9067930590053,
              y: 278.8443940841202,
            },
            number: 6,
            prefix: "A",
            status: 0,
          },
          {
            name: "A-7",
            coordinates: {
              x: 521.6105727838254,
              y: 289.34773239071967,
            },
            number: 7,
            prefix: "A",
            status: 1,
          },
          {
            name: "A-8",
            coordinates: {
              x: 552.3978596294135,
              y: 296.06749215051167,
            },
            number: 8,
            prefix: "A",
            status: 0,
          },
          {
            name: "A-9",
            coordinates: {
              x: 583.7419920479897,
              y: 299.3442416146619,
            },
            number: 9,
            prefix: "A",
            status: 1,
          },
          {
            name: "A-10",
            coordinates: {
              x: 615.2580079520101,
              y: 299.34424161466194,
            },
            number: 10,
            prefix: "A",
            status: 0,
          },
          {
            name: "A-11",
            coordinates: {
              x: 646.6021403705864,
              y: 296.0674921505116,
            },
            number: 11,
            prefix: "A",
            status: 1,
          },
          {
            name: "A-12",
            coordinates: {
              x: 677.3894272161743,
              y: 289.3477323907197,
            },
            number: 12,
            prefix: "A",
            status: 0,
          },
          {
            name: "A-13",
            coordinates: {
              x: 707.0932069409946,
              y: 278.8443940841203,
            },
            number: 13,
            prefix: "A",
            status: 1,
          },
          {
            name: "A-14",
            coordinates: {
              x: 734.8966715370306,
              y: 264.0511521760317,
            },
            number: 14,
            prefix: "A",
            status: 0,
          },
          {
            name: "A-15",
            coordinates: {
              x: 759.4842318146154,
              y: 244.40462063562433,
            },
            number: 15,
            prefix: "A",
            status: 1,
          },
          {
            name: "A-16",
            coordinates: {
              x: 778.9101112929452,
              y: 219.67798099307538,
            },
            number: 16,
            prefix: "A",
            status: 0,
          },
          {
            name: "A-17",
            coordinates: {
              x: 791.0642255617884,
              y: 190.6961368424079,
            },
            number: 17,
            prefix: "A",
            status: 1,
          },
          {
            name: "A-18",
            coordinates: {
              x: 795,
              y: 159.5,
            },
            number: 18,
            prefix: "A",
            status: 0,
          },
        ],
        centerPoint: {
          x: 599.5,
          y: 159.5,
          lock: false,
        },
        row: "A",
      },
    ]

    const layerRef2 = React.useRef(null)
    const layerRefStatic = React.useRef(null)
    const stageRef2 = React.useRef(null)

    const selectedSeatsRef = React.useRef({})

    const handleCanvasDraw = () => {
      Konva.hitOnDragEnabled = true

      const throttledRedraw = throttle(redrawStuff, 1000)
      debouncedCacheClear = debounce(clearCacheExtensively, 5000)
      debouncedCache = debounce(cacheChildren, 1000)
      debouncedRedraw = debounce(redrawStuff, 1000)

      stageRef2.current = new Konva.Stage({
        container: "container",
        width: window.innerWidth,
        height: window.innerHeight,
        draggable: true,
      })

      layerRef2.current = new Konva.Layer()
      layerRefStatic.current = new Konva.Layer()

      layerRefStatic.current.listening(false)

      const stage = stageRef2.current
      const layer = layerRef2.current
      const staticLayer = layerRefStatic.current

      stage.add(staticLayer)
      stage.add(layer)

      drawChildren()
      staticLayer.draw()
      layer.draw()

      layer.on("click tap", (e) => {
        const { seatProps = {} } = e.target.attrs
        const seat = e.target

        // clearCacheExtensively()

        const isAlreadySelected = selectedSeatsRef.current[seatProps.name]

        if (!isAlreadySelected) {
          selectedSeatsRef.current[seatProps.name] = true
        } else {
          delete selectedSeatsRef.current[seatProps.name]
        }

        seat.fill && seat.fill(isAlreadySelected ? "transparent" : "red")
        seat.draw && seat.draw()

        // cacheChildren()
        // drawChildren()
      })

      //   event listeners //
      stage.on("touchmove", function (e) {
        e.evt.preventDefault()
        var touch1 = e.evt.touches[0]
        var touch2 = e.evt.touches[1]

        if (touch1 && touch2) {
          // if the stage was under Konva's drag&drop
          // we need to stop it, and implement our own pan logic with two pointers
          if (stage.isDragging()) {
            stage.stopDrag()
          }

          if (!cacheExists) {
            debouncedCache()
          }

          var p1 = {
            x: touch1.clientX,
            y: touch1.clientY,
          }
          var p2 = {
            x: touch2.clientX,
            y: touch2.clientY,
          }

          if (!lastCenter) {
            lastCenter = getCenter(p1, p2)
            return
          }
          var newCenter = getCenter(p1, p2)

          var dist = getDistance(p1, p2)

          if (!lastDist) {
            lastDist = dist
          }

          // local coordinates of center point
          var pointTo = {
            x: (newCenter.x - stage.x()) / stage.scaleX(),
            y: (newCenter.y - stage.y()) / stage.scaleX(),
          }

          var scale = stage.scaleX() * (dist / lastDist)

          stage.scaleX(scale)
          stage.scaleY(scale)

          // calculate new position of the stage
          var dx = newCenter.x - lastCenter.x
          var dy = newCenter.y - lastCenter.y

          var newPos = {
            x: newCenter.x - pointTo.x * scale + dx,
            y: newCenter.y - pointTo.y * scale + dy,
          }

          stage.position(newPos)
          stage.batchDraw()

          lastDist = dist
          lastCenter = newCenter
        } else {
          //   if (stage._lastPos) {
          //     xOff = -stage._lastPos.x
          //     yOff = -stage._lastPos.y
          //     throttledRedraw()
          //   }
        }
      })

      stage.on("touchend", function () {
        lastDist = 0
        lastCenter = null
      })

      stage.on("dragend", function (e) {
        // return
        debouncedCacheClear()
        xOff = -e.target.x()
        yOff = -e.target.y()
        debouncedRedraw()
        debouncedCache()
      })

      stage.on("dragstart", function () {
        if (!cacheExists) {
          cacheChildren()
        }
      })

      hasDrawed = true
      //   cacheChildren()
    }

    const drawChildren = () => {
      const stage = stageRef2.current
      const layer = layerRef2.current
      const staticLayer = layerRefStatic.current

      console.log("drawing")
      seatData.forEach((seatRow, i) => {
        // const isOut = i > (window.innerHeight + yOff) / 20

        // if (isOut) {
        //   return
        // }

        const { seats, row } = seatRow

        const currX = seats[0].coordinates.x //
        const currY = seats[0].coordinates.y //

        const rowText = new Konva.Text({
          x: currX - 30,
          y: currY - 10,
          text: row,
          fontSize: 15,
          listening: false,
          perfectDrawEnabled: false,
        })

        staticLayer.add(rowText)

        seats.forEach((seat, seatIndex) => {
          const isOut = seatIndex > (window.innerWidth + xOff) / 25 + 20
          const { coordinates, number, name } = seat
          const startX = Math.floor((-stage.x() - stage.width()) / 25) * 25
          // const endX = Math.floor((-stage.x() + stage.width()) / 25) * 25
          const endX = Math.floor((-stage.x() + stage.width() * 2) / 25) * 25

          const isOut2 = coordinates.x + 25 * 25 >= -stage.x()

          const isIn = coordinates.x > startX && coordinates.x < endX

          if (isOut || !isOut2) {
            return
          }

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
            // transformsEnabled: "position",
            name: `seat-rect-${coordinates.x}-${coordinates.y}`,
            seatProps: seat,
          })

          const seatText = new Konva.Text({
            x: coordinates.x - 4,
            y: coordinates.y - 4,
            text: number,
            fontSize: 10,
            listening: false,
            perfectDrawEnabled: false,
          })

          staticLayer.add(seatText)

          // if (isOut || !isOut2) {
          //   staticLayer.add(seatRect)
          // } else {
          //   layer.add(seatRect)
          // }

          layer.add(seatRect)
        })
      })

      console.log(44, layerRef2.current.children)
    }

    const redrawStuff = () => {
      console.log("redrawing")
      layerRef2.current.destroyChildren()
      layerRefStatic.current.destroyChildren()
      drawChildren()
    }

    const clearCacheExtensively = () => {
      const canvasLayerElements = stageRef2.current.getLayers()
      for (let i = 0; i < canvasLayerElements.length; i += 1) {
        const cachedCanvases = canvasLayerElements[i]._cache.get("canvas")
        if (cachedCanvases) {
          cachedCanvases.scene._canvas.width = 0
          cachedCanvases.scene._canvas.height = 0
          cachedCanvases.hit._canvas.width = 0
          cachedCanvases.hit._canvas.height = 0
          cachedCanvases.filter._canvas.width = 0
          cachedCanvases.filter._canvas.height = 0
          canvasLayerElements[i].clearCache()
        }
      }
      cacheExists = false
    }

    const cacheChildren = () => {
      //   layerRef2.current.cache()
      //   layerRef2.current.destroyChildren()
      //   stageRef2.current.children.cache()
      layerRef2.current.cache()
      layerRefStatic.current.cache()
      layerRef2.current.children.cache()
      layerRefStatic.current.children.cache()
      cacheExists = true
      //   layerRef2.current.destroyChildren()
      //   layerRef2.current.children.cache()
      //   console.log(layerRef2.current.children)
      //   layerRef2.current.children.forEach((xa, ya) => {
      //     const { attrs } = xa
      //     const { x, y } = xa
      //     const isOut = ya > (window.innerWidth + useView.x) / 25 + 50
      //     if (isOut) {
      //     } else {
      //       //   xa.cache()
      //     }
      //     xa.cache()
      //   })
      // this.cacheExists = true;
    }

    React.useEffect(() => {
      if (props.data.length > 0 && !hasDrawed) {
        handleCanvasDraw()
      }
    }, [props.data])

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
    )
  },
  (a, b) => {
    return a.data === b.data
  }
)

export default MainStage
