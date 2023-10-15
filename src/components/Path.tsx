import React from "react";
import type { Vector2d } from "konva/lib/types";
import { Circle, Line } from "react-konva";

export default function Path({
  points,
  color,
}: {
  points: Vector2d[];
  color: string;
}): JSX.Element {
  return (
    <>
      {points.map((point, i) => {
        const previousPoint = i > 0 ? points.at(i - 1) : null;

        return (
          <>
            {previousPoint && (
              <Line
                x={previousPoint.x}
                y={previousPoint.y}
                points={[
                  0,
                  0,
                  point.x - previousPoint.x,
                  point.y - previousPoint.y,
                ]}
                stroke={color}
                strokeWidth={0.3}
              />
            )}
            <Circle x={point.x} y={point.y} radius={0.3} fill={color} />
          </>
        );
      })}
    </>
  );
}
