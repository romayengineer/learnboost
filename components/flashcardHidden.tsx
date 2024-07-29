"use client";
import React from "react";
import EasyButtons from "./easyButtons";
import { RecallData } from "@/app/dbTypes";

export default function FlashCardHidden(params: {
  next: (data: RecallData) => void;
  id: string;
  front: string;
  back: string;
}) {
  const [startTime, setStartTime] = React.useState(Date.now());
  const [frontTimeDiff, setFrontTimeDiff] = React.useState(0);
  const [backTimeDiff, setBackTimeDiff] = React.useState(0);
  // TODO collapse CSS class makes the div dissapear
  const [showBack, setShowBack] = React.useState(false);
  // TODO delete, this is so the front is long enough
  const space = Array(119).join(".");

  var toggleShowBack = () => {
    // disable show back if id is empty string
    if (params.id === "") return;
    const newShowBack = !showBack;
    setShowBack(newShowBack);
    setFrontTimeDiff(Date.now() - startTime);
  };

  return (
    <div
      style={{ maxWidth: "700px" }}
      className="p-6 p-4 border-4 collapse-open border bg-sky-300"
    >
      <input type="radio" name="my-accordion-1" hidden />
      <div
        style={{ minHeight: "60px" }}
        className="collapse-title text-xl font-medium"
        onClick={toggleShowBack}
      >
        {params.front}
        <br />
        <span className="truncate text-sky-300">{space}</span>
      </div>
      {showBack && (
        <div>
          <br />
          <div style={{ minHeight: "200px" }} className="collapse-content">
            <p>{params.back}</p>
          </div>
          <br />
          <EasyButtons
            next={(easy) => {
              var _backTimeDiff = Date.now() - startTime;
              _backTimeDiff =
                _backTimeDiff >= frontTimeDiff ? _backTimeDiff : frontTimeDiff;
              setBackTimeDiff(_backTimeDiff);
              setShowBack(false);
              params.next({
                easy: easy,
                flashcardId: params.id,
                timeFront: frontTimeDiff,
                timeBack: _backTimeDiff,
              } as RecallData);
            }}
          />
        </div>
      )}
    </div>
  );
}
