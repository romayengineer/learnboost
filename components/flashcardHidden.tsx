"use client";
import React from "react";

export default function FlashCardHidden(params: {
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
      style={{ width: "600px" }}
      className="p-6 p-4 border-4 collapse-open border bg-stone-300"
      onClick={toggleShowBack}
    >
      <input type="radio" name="my-accordion-1" hidden />
      <div className="collapse-title text-xl font-medium">
        <p>{params.front}</p>
      </div>
      {showBack && (
        <div>
          <br />
          <div className="collapse-content">
            <p>{params.back}</p>
          </div>
        </div>
      )}
    </div>
  );
}
