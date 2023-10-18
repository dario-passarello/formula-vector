import React, { useEffect, useState } from "react";
import "./App.css";
import { Stage, Layer, Image } from "react-konva";
import type { KonvaEventObject } from "konva/lib/Node";
import type { Vector2d } from "konva/lib/types";
import Selector from "./components/Selector";
import Path from "./components/Path";
import type { CameraPosition } from "./utils/types";
import { vectorAdd, vectorDiff } from "./utils/vectors";
import useImage from "use-image";
import { processImage } from "./utils/utils";

function App(): JSX.Element {
  const originalPos: Vector2d = { x: 650, y: 150 };

  const [stage, setStage] = useState<CameraPosition>({
    scale: 100,
    ...originalPos,
  });

  const imagePath = process.env.PUBLIC_URL + "/test_track.png";

  const [image] = useImage(imagePath);

  let imageData : Uint8ClampedArray;

  useEffect(() => {
    processImage(process.env.PUBLIC_URL + "/test_track.png", (a) => {
      imageData = a;
    });
  }, [imagePath]);

  const [positions, setPositions] = useState<Vector2d[]>([originalPos]);

  const handleWheel = (e: KonvaEventObject<WheelEvent>): void => {
    e.evt.preventDefault();

    const scaleBy = 1.3;
    const stage = e.target.getStage();
    if (!stage) {
      return;
    }
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) {
      return;
    }
    const oldScale = stage.scaleX();

    const mousePointTo = {
      x: pointerPos.x / oldScale - stage.x() / oldScale,
      y: pointerPos.y / oldScale - stage.y() / oldScale,
    };

    let newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    newScale = Math.max(Math.min(newScale, 200), 0.2);

    setStage({
      scale: newScale,
      x: (pointerPos.x / newScale - mousePointTo.x) * newScale,
      y: (pointerPos.y / newScale - mousePointTo.y) * newScale,
    });
  };

  const handleStageDrag = (e: KonvaEventObject<DragEvent>): void => {
    setStage({ ...stage, x: e.target.x(), y: e.target.y() });
  };

  // console.log(stage);

  return (
    <div className="flex flex-col">
      <Stage
        x={stage.x}
        y={stage.y}
        scaleX={stage.scale}
        scaleY={stage.scale}
        width={window.innerWidth}
        height={window.innerHeight}
        onWheel={handleWheel}
        onDragStart={handleStageDrag}
        onDragMove={handleStageDrag}
        onDragEnd={handleStageDrag}
        draggable
        className="flex-9"
      >
        <Layer>
          <Image image={image} />
        </Layer>
        <Layer>
          <Path points={positions} color="blue" />

          <Selector
            center={vectorAdd(
              positions[positions.length - 1],
              vectorDiff(
                positions[positions.length - 1],
                positions.length > 1
                  ? positions[positions.length - 2]
                  : originalPos
              )
            )}
            previousPosition={positions.at(positions.length - 1)}
            radius={4}
            onPositionChosen={(pos) => {
              setPositions([...positions, pos]);
            }}
          />
        </Layer>
      </Stage>
      <div className="flex flex-row flex-2">Cacca</div>
    </div>
  );
}

export default App;
