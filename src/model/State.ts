import type { Vector2d } from "konva/lib/types";
import { vectorAdd, vectorDiff } from "../utils/vectors";
import { range } from "../utils/utils";

interface GameState {
  circuitData: Uint8ClampedArray;
  players: Player[];
  currentPlayer: Player;
}

interface Player {
  name: string;
  startPos: Vector2d;
  moves: Move[];
  car: Car;
}

interface Car {
  type: "circle";
  radius: 2;
}

interface Move {
  from: Vector2d;
  to: Vector2d;
  action: PlayerAction;
  events: RaceEvent[];
}

type RaceEvent =
  | {
      type: "skipTurn";
      turnRemaining: number;
    }
  | {
      type: "crash";
      crashPosition: Vector2d;
      turnToSkip: number;
    };

type PlayerAction = MoveAction;

interface MoveAction {
  type: "move";
  dv: Vector2d | null;
}

function getPlayerPosition(player: Player): [Vector2d, Vector2d] {
  if (player.moves.length === 0) {
    return [player.startPos, player.startPos];
  }
  const lastMove = player.moves[player.moves.length - 1];
  return [lastMove.from, lastMove.to];
}

function processMovement(
  state: GameState,
  action: PlayerAction & { type: "move" }
): GameState {
  const currPlayer = state.currentPlayer;
  const lastMove = currPlayer.moves.at(currPlayer.moves.length - 1);
  if (!lastMove) {
    // No moves performed
  } else {
    if (
      lastMove.events.filter(
        (v) => v.type === "skipTurn" && v.turnRemaining > 0
      ).length > 0
    ) {
      return null;
    }

    const v = vectorDiff(lastMove.to, lastMove.from);
    const destination = vectorAdd(v, action.dv ?? { x: 0, y: 0 });
  }
}

/**
 * Traces all the square crossed by an oriented segment in a grid made of 1x1 squares.
 * The strategy of this function is to walk trough the segment listing all the grid line crossed.
 * The function uses heavily the parametric definition of a line
 * ```
 * x = p0.x + (p1.x - p0.x) * t
 * y = p0.y + (p1.y - p0.y) * t
 * ```
 * Where t goes from 0 to 1 and represents a point on the segment. (t = 0 is p0, t = 1 is p1, other values are the intermediate points).
 * @param p0 The starting point of the segment
 * @param p1 The ending point of the segment
 * @returns List of all the squares crossed by the line, with the order in which they were encountered by the line. First and last squares are included.
 */
function traceLine(p0: Vector2d, p1: Vector2d): Vector2d[] {
  const startSquareX = Math.floor(p0.x);
  const startSquareY = Math.floor(p0.y);

  const destSquareX = Math.floor(p1.x);
  const destSquareY = Math.floor(p1.y);

  const crossedSquares: Vector2d[] = [{ x: startSquareX, y: startSquareY }];

  // Edge case 1: Segment stands in a single square
  if (startSquareX === destSquareX && startSquareY === destSquareY) {
    return [{ x: destSquareX, y: destSquareY }];
  }

  // Verse of the oriented segment
  // +1 => Coordinate is increasing
  // -1 => Coordinate is decreasing
  const dx = Math.sign(p1.x - p0.x);
  const dy = Math.sign(p1.y - p0.y);

  // Edge Case 2: Segment crosses squares in the same row
  if (startSquareY === destSquareY) {
    crossedSquares.push(
      ...range(startSquareX + dx, destSquareX + dx, dx).map((x) => {
        return { x, y: destSquareY };
      })
    );
    return crossedSquares;
  }
  // Edge Case 3: Segment crosses squares in the same column
  if (startSquareX === destSquareX) {
    crossedSquares.push(
      ...range(startSquareY + dy, destSquareY + dy, dy).map((y) => {
        return { x: destSquareX, y };
      })
    );
  }

  // Current position in line
  let currX = p0.x;
  let currY = p0.y;
  // Functions that calculate the next possible crossing based on the verse of the segment
  const roundingFx =
    dx === 1
      ? (x: number) => Math.floor(x + 1)
      : (x: number) => Math.ceil(x - 1);
  const roundingFy =
    dy === 1
      ? (x: number) => Math.floor(x + 1)
      : (x: number) => Math.ceil(x - 1);

  let currT;

  do {
    // Find the values of t for which the segment crosses the next x grid line or y grid line
    const nextCrossXt = (roundingFx(currX) - p0.x) / (p1.x - p0.x);
    const nextCrossYt = (roundingFy(currY) - p0.y) / (p1.y - p0.y);
    // console.log(`nextCrossXt: ${nextCrossXt} nextCrossYt: ${nextCrossYt}`)
    if (nextCrossXt < nextCrossYt) {
      // x grid line in encountered first
      currX = roundingFx(currX);
      currT = nextCrossXt;
      currY = p0.y + (p1.y - p0.y) * currT;
    } else {
      // y grid line in encountered first
      currT = nextCrossYt;
      currX = p0.x + (p1.x - p0.x) * currT;
      currY = roundingFy(currY);
    }
    crossedSquares.push({ x: Math.floor(currX), y: Math.floor(currY) });
    // console.log(`currX: ${currX} currY: ${currY}`)
  } while (
    Math.floor(currX) !== destSquareX &&
    Math.floor(currY) !== destSquareY
  );

  // At the end of the loop we fall back to either Edge case 1, 2 or 3
  // Edge case 2
  if (Math.floor(currX) !== destSquareX) {
    crossedSquares.push(
      ...range(Math.floor(currX) + dx, destSquareX + dx, dx).map((x) => {
        return { x, y: destSquareY };
      })
    );
    return crossedSquares;
  }
  // Edge case 3
  if (Math.floor(currY) !== destSquareY) {
    crossedSquares.push(
      ...range(Math.floor(currY) + dy, destSquareY + dy, dy).map((y) => {
        return { x: destSquareX, y };
      })
    );
    return crossedSquares;
  }
  // Edge case 1
  return crossedSquares;
}
