import React, { Fragment } from "react";
import { DragInfo } from "./baseTypes";

const getEventPosition = (evt: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
  if ('touches' in evt && evt.touches.length > 0) {
    return { x: evt.touches[0].clientX, y: evt.touches[0].clientY };
  }
  return { x: (evt as React.MouseEvent).clientX, y: (evt as React.MouseEvent).clientY };
};

const Red = ({ onMouseDown }) => {
  const handleStart = (evt: React.MouseEvent | React.TouchEvent) => {
    evt.preventDefault();
    const pos = getEventPosition(evt);
    onMouseDown(pos, "paint-red");
  };
  return (
    <div
      className="command paint paint-red"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    />
  );
};
const Green = ({ onMouseDown }) => {
  const handleStart = (evt: React.MouseEvent | React.TouchEvent) => {
    evt.preventDefault();
    const pos = getEventPosition(evt);
    onMouseDown(pos, "paint-green");
  };
  return (
    <div
      className="command paint paint-green"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    />
  );
};
const Blue = ({ onMouseDown }) => {
  const handleStart = (evt: React.MouseEvent | React.TouchEvent) => {
    evt.preventDefault();
    const pos = getEventPosition(evt);
    onMouseDown(pos, "paint-blue");
  };
  return (
    <div
      className="command paint paint-blue"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    />
  );
};


interface ColorCommandsProps {
  colors: number,
  onMouseDown: any,
}


const ColorCommands = ({ colors, onMouseDown }: ColorCommandsProps) => {
  if (colors === 1) {
    return (
      <Fragment>
        <Red onMouseDown={onMouseDown} />
        <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 2) {
    return (
      <Fragment>
        <Green onMouseDown={onMouseDown} />
        <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 3) {
    return (
      <Fragment>
        <Red onMouseDown={onMouseDown} />
        <Green onMouseDown={onMouseDown} />
        <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 4) {
    return (
      <Fragment>
        <Blue onMouseDown={onMouseDown} /> <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 5) {
    return (
      <Fragment>
        <Red onMouseDown={onMouseDown} />
        <Blue onMouseDown={onMouseDown} /> <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 6) {
    return (
      <Fragment>
        <Green onMouseDown={onMouseDown} />
        <Blue onMouseDown={onMouseDown} /> <div className="divider" />
      </Fragment>
    );
  }
  if (colors === 7) {
    return (
      <Fragment>
        <Red onMouseDown={onMouseDown} />
        <Green onMouseDown={onMouseDown} />
        <Blue onMouseDown={onMouseDown} /> <div className="divider" />
      </Fragment>
    );
  }
  return null;
};


interface CommandsProps {
  SubLengths: number[],
  AllowedCommands: number,
  dragging: DragInfo | null,
  onMouseDown: any,
}


const Commands = ({ SubLengths, AllowedCommands, dragging, onMouseDown }: CommandsProps) => {
  const createHandler = (command: string | null, color: string = "") => {
    return (evt: React.MouseEvent | React.TouchEvent) => {
      evt.preventDefault();
      const pos = getEventPosition(evt);
      onMouseDown(pos, command, color);
    };
  };

  return (
    <div className={`commands-area ${dragging ? "dragging" : ""}`}>
      <div
        className="command forward"
        onMouseDown={createHandler("forward", "")}
        onTouchStart={createHandler("forward", "")}
      />
      <div
        className="command left"
        onMouseDown={createHandler("left", "")}
        onTouchStart={createHandler("left", "")}
      />
      <div
        className="command right"
        onMouseDown={createHandler("right", "")}
        onTouchStart={createHandler("right", "")}
      />
      <div className="divider" />
      {SubLengths.map(
        (s, i) =>
          s > 0 && (
            <div
              key={`sublength-${i}`}
              className={`command f${i}`}
              onMouseDown={createHandler(`f${i}`)}
              onTouchStart={createHandler(`f${i}`)}
            />
          )
      )}
      <div className="divider" />
      <ColorCommands
        colors={AllowedCommands}
        onMouseDown={onMouseDown}
      />
      <div
        className="command color clear"
        onMouseDown={createHandler(null, "clear")}
        onTouchStart={createHandler(null, "clear")}
      />
      <div
        className="command color red"
        onMouseDown={createHandler(null, "red")}
        onTouchStart={createHandler(null, "red")}
      />
      <div
        className="command color green"
        onMouseDown={createHandler(null, "green")}
        onTouchStart={createHandler(null, "green")}
      />
      <div
        className="command color blue"
        onMouseDown={createHandler(null, "blue")}
        onTouchStart={createHandler(null, "blue")}
      />
    </div>
  );
};

export default Commands;
