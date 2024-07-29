"use client";

import React from "react";
import FlashCardHidden from "@/components/flashcardHidden";

export default function FlashcardsStudy(params: {
  flashcards: Array<{ front: string; back: string }>;
}) {
  var [flashcard, setFlashcard] = React.useState(params.flashcards[0]);
  var next = (easy: number) => {
    // easy goes from 0 to 3
    setFlashcard(
      params.flashcards[Math.floor(Math.random() * params.flashcards.length)]
    );
  };
  return (
    <main>
      <FlashCardHidden
        next={next}
        front={flashcard.front}
        back={flashcard.back}
      />
    </main>
  );
}
