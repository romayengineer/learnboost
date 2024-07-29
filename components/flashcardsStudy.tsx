"use client";

import React from "react";
import FlashCardHidden from "@/components/flashcardHidden";
import FlashcardsCounter from "./flashcardsCounter";
import { login, sendRecall } from "@/app/db";

export default function FlashcardsStudy(params: {
  flashcards: Array<{ id: string; front: string; back: string }>;
}) {
  var pb = login();
  //   var randomIndex = Math.floor(Math.random() * params.flashcards.length);
  var randomIndex = 0;
  var [flashcardCount, setFlashcardCount] = React.useState(1);
  var [flashcard, setFlashcard] = React.useState(
    params.flashcards[randomIndex]
  );
  var next = (
    easy: number,
    flashcardId: string,
    timeFront: number,
    timeBack: number
  ) => {
    // easy goes from 0 to 3
    var newFlashcard = flashcard;
    if (params.flashcards.length > 1) {
      while (newFlashcard == flashcard) {
        var randomIndex = Math.floor(Math.random() * params.flashcards.length);
        newFlashcard = params.flashcards[randomIndex];
      }
    }
    if (newFlashcard != flashcard) {
      setFlashcard(newFlashcard);
      setFlashcardCount((prev) => prev + 1);
      sendRecall(pb, flashcardId, timeFront, timeBack, easy);
    }
  };
  return (
    <main>
      <FlashcardsCounter count={flashcardCount} />
      <FlashCardHidden
        next={next}
        id={flashcard.id}
        front={flashcard.front}
        back={flashcard.back}
      />
    </main>
  );
}
