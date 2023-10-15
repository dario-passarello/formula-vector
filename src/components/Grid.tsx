import React from "react";
import { Line } from "react-konva";
import { range } from "../utils/utils";
import type { CameraPosition, StageInfo } from "../utils/types";

export default function Grid(props: {
  camera: CameraPosition;
  stage: StageInfo;
}): JSX.Element {
  const { camera, stage } = props;
  const xBegin = -camera.x / camera.scale;
  const xEnd = (-camera.x + stage.width) / camera.scale;
  const yBegin = -camera.y / camera.scale;
  const yEnd = (-camera.y + stage.heigth) / camera.scale;
  console.log(`Length is ${range(Math.ceil(xBegin), xEnd).length}`);
  return (
    <>
      <>
        {range(Math.ceil(xBegin), xEnd).map((x, i) => {
          return (
            <Line
              x={x}
              y={yBegin}
              key={i}
              points={[0, 0, 0, yEnd - yBegin]}
              stroke={"rgba(0,0,0,0.2)"}
              strokeWidth={1 / camera.scale}
            />
          );
        })}
      </>
      <>
        {range(Math.ceil(yBegin), yEnd).map((y, i) => {
          return (
            <Line
              x={xBegin}
              y={y}
              key={i}
              points={[0, 0, xEnd - xBegin, 0]}
              stroke={"rgba(0,0,0,0.2)"}
              strokeWidth={1 / camera.scale}
            />
          );
        })}
      </>
    </>
  );
}
