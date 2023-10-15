import React, { useState } from "react";

import type { KonvaEventObject } from "konva/lib/Node";
import type { Vector2d } from "konva/lib/types";
import { Circle, Line } from "react-konva";

export default function Selector({
  center,
  radius,
  previousPosition,
  onPositionChosen = (pos) => {},
}: {
  center: Vector2d;
  radius: number;
  onPositionChosen?: (pos: Vector2d) => void;
  previousPosition?: Vector2d;
}): JSX.Element {
  const [hoverPos, setHoverPos] = useState<Vector2d | null>(null);

  const hoverEvent = (leave: boolean) => (e: KonvaEventObject<MouseEvent>) => {
    if (leave) {
      setHoverPos(null);
    } else {
      const stage = e.target.getStage();
      const mousePos = stage?.getPointerPosition();
      const transform = stage?.getAbsoluteTransform().copy().invert();
      if (!transform || !mousePos) {
        setHoverPos(null);
        return;
      }
      const worldPos = transform.point(mousePos);

      setHoverPos(worldPos);
    }
  };

  return (
    <>
      {hoverPos && (
        <Circle
          x={hoverPos.x}
          y={hoverPos.y}
          z={-100}
          radius={0.2}
          fill="black"
        />
      )}
      {hoverPos && previousPosition && (
        <Line
          x={previousPosition.x}
          y={previousPosition.y}
          points={[
            0,
            0,
            hoverPos.x - previousPosition.x,
            hoverPos.y - previousPosition.y,
          ]}
          stroke={"rgba(0,0,0,0.2)"}
          strokeWidth={0.2}
        />
      )}
        {hoverPos && previousPosition && (
        <Line
          x={hoverPos.x}
          y={hoverPos.y}
          points={[
            0,
            0,
            hoverPos.x - previousPosition.x,
            hoverPos.y - previousPosition.y,
          ]}
          stroke={"rgba(0,0,0,0.2)"}
          strokeWidth={0.2}
          dash={[0.4,0.4]}
        />
      )}
      <Circle
        x={center.x}
        y={center.y}
        radius={radius}
        stroke={hoverPos ? "rgb(255,0,0)" : "rgb(0,255,0)"}
        strokeWidth={0.4}
        onMouseEnter={hoverEvent(false)}
        onMouseMove={hoverEvent(false)}
        onMouseLeave={hoverEvent(true)}
        onClick={(e) => {
          if (hoverPos) {
            onPositionChosen(hoverPos);
          }
        }}
      />
    </>
  );
}
