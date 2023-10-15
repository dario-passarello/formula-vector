import type { Vector2d } from "konva/lib/types";

export function vectorAdd(v1: Vector2d, v2: Vector2d): Vector2d {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
}

export function vectorDiff(v1: Vector2d, v2: Vector2d): Vector2d {
  return {
    x: v1.x - v2.x,
    y: v1.y - v2.y,
  };
}
