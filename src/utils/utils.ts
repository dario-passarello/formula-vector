export const range = (x: number, y: number): number[] =>
  Array.from({ length: y - x }, (_, i) => i + x);