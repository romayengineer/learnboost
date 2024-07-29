"use client";
import React from "react";
import EasyButtons from "./easyButtons";

export default function FlashCardHidden(params: {
  next: (x: number) => void;
  front: string;
  back: string;
}) {
  // TODO collapse CSS class makes the div dissapear
  const [showBack, setShowBack] = React.useState(false);

  var toggleShowBack = () => {
    const newShowBack = !showBack;
    setShowBack(newShowBack);
  };

  return (
    <div
      style={{ width: "700px" }}
      className="p-6 p-4 border-4 collapse-open border bg-stone-300"
    >
      <input type="radio" name="my-accordion-1" hidden />
      <div
        style={{ height: "60px" }}
        className="collapse-title text-xl font-medium"
        onClick={toggleShowBack}
      >
        <p>{params.front}</p>
      </div>
      {showBack && (
        <div>
          <br />
          <div style={{ height: "200px" }} className="collapse-content">
            <p>{params.back}</p>
          </div>
          <br />
          <EasyButtons
            next={(easy) => {
              setShowBack(false);
              params.next(easy);
            }}
          />
        </div>
      )}
    </div>
  );
}
