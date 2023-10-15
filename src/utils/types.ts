import type { Vector2d } from "konva/lib/types";

export type CameraPosition = Vector2d & { scale: number };

export interface StageInfo {
  width: number;
  heigth: number;
}
