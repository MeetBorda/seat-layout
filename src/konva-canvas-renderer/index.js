import React, { Fragment, memo, useState } from "react"
import { Stage, Layer, FastLayer, Text } from "react-konva"
import Konva from "konva"

import Row from "./Row"
import logo from "./loader.gif"
const MAX_SEATS = 21
const SEAT_LENGTH = 22
const SRMC = true
const xL = true

const TEXT_OFFSET = -5

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
    let selectedSeats = []
    const stageRef = React.useRef(null)
    const layerRef = React.useRef(null)
    const [useView, setView] = useState({ x: 0, y: 0 })
    // if (seatData.length === 0) {
    //   return (
    //     <div>
    //       <img src={logo} />
    //     </div>
    //   );
    // }

    // const size = {
    //   width:
    //     seatData.length <= 50
    //       ? seatData.length * seatData[0].seats.length * 10
    //       : (seatData.length / 2.2) * seatData[0].seats.length,
    //   height:
    //     seatData.length <= 50
    //       ? seatData.length * 22 + 400
    //       : (seatData.length / 1.25) * 22,
    // };

    // const size = {
    //   width: seatData ? seatData.length * seatData[0].seats.length * 22 : 0,
    //   height: seatData ? seatData.length * 22 + 200 : 0,
    // };

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
      //  setSelectedSeats(seats);
    }
    // const finalWidth = size.width + calculateWidth();
    // console.log("once", layerRef.current, seatData)

    // React.useEffect(() => {
    //   if (!stageRef.current) {
    //     return;
    //   }
    //   if (seatData.length <= 50) {
    //     return;
    //   }
    //   const stage = stageRef.current;
    //   const clientRect = stage.getClientRect({ skipTransform: true });
    //   const fact = seatData.length <= 50 ? 1 : 2;
    //   const scaleToFit = size.width / clientRect.width / fact;
    //   setVirtualWidth(clientRect.width);
    //   setScale(scaleToFit);
    // }, [size]);
    const handleDragEnd = (e) => {
      setView({
        x: -e.target.x(),
        y: -e.target.y(),
      })
      //   getThousand()
    }
    const getThousand = () => {
      return
      console.log("func", useView)
      seatData.map((rowData) => {
        const { i, row, centerPoint, seats, select, deselect } = rowData
        const currX = seats[0].coordinates.x //
        const currY = seats[0].coordinates.y //
        const rowText = new Konva.Text({
          x: currX - 20,
          y: currY - 20,
          text: row,
          fontSize: 15,
        })
        layerRef.current.add(rowText)
        seats.map((seat, i) => {
          const { coordinates, name, number, select, deselect, status } = seat
          const { x, y } = coordinates
          const view = i * 30
          const isOut =
            view < useView.x - window.innerWidth ||
            view > useView.x + window.innerWidth * 2
          const currX = x
          const currY = y
          if (isOut) {
            return
          }
          const circle = new Konva.Circle({
            x: i * 30,
            y: currY,
            radius: 10,
            fill: "white",
            stroke: "green",
            strokeWidth: 1,
            props: { ...seat },
          })
          layerRef.current.add(circle)
        })
      })

      console.log(layerRef.current.getChildren())
      layerRef.current.draw()
      // let X = 0;
      // let Y = 0;
      // for (var n = 0; n < 1000; n++) {
      //   X = X + 7;
      //   Y = Y + 7;

      //   layerRef.current.add(circle);
      // }
    }

    // React.useEffect(() => {
    //   if (layerRef.current && props.data) {
    //     getThousand()
    //   }
    // }, [props.data])
    if (layerRef.current) {
      console.log(layerRef.current.getChildren())
    }

    React.useEffect(() => {
      if (useView.x > 0 || useView.y > 0) {
        stageRef.current.children.cache()
      }
    }, [useView])

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
        <Stage
          ref={stageRef}
          width={window.innerWidth}
          height={window.innerHeight}
          // width={xL ? 3000 : size.width}
          // height={xL ? 3000 : size.height * 2}
          //   width={500}
          //   height={500}
          scaleX={1}
          scaleY={1}
          draggable
          onDragEnd={handleDragEnd}
          onClick={(e) => console.log(e.target.attrs, getThousand())}
        >
          <Layer
            ref={layerRef}
            offsetY={0}
            offsetX={0}
            onTap={(e) => console.log(e.target.attrs)}
          >
            <Fragment>
              {seatData.map((e, i) => {
                const isOut = i > (window.innerHeight + useView.y) / 25 + 50

                if (isOut) return null

                return (
                  <Row
                    {...e}
                    key={`${e.row}-${e.centerPoint.x}-${e.centerPoint.y}-${i}`}
                    i={i}
                    useView={useView}
                    select={handleSelect}
                    deselect={handleDeselect}
                  />
                )
              })}
            </Fragment>
          </Layer>
          {/* <Layer listening={false}>
            {seatData.map((seat) => {
              return seat.seats.map((s) => {
                const { coordinates, number } = s
                const { x, y } = coordinates
                return (
                  <Text
                    x={x + TEXT_OFFSET}
                    y={y + TEXT_OFFSET}
                    text={number}
                    listening={false}
                  />
                )
              })
            })}
          </Layer> */}
        </Stage>
      </div>
    )
  },
  (a, b) => {
    return a.data === b.data
  }
)

export default MainStage
