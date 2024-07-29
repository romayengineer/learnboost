"use client";

import React from "react";
import FlashCardHidden from "@/components/flashcardHidden";

export default function FlashcardsStudy(params: {
  flashcards: Array<{ front: string; back: string }>;
}) {
  //   var randomIndex = Math.floor(Math.random() * params.flashcards.length);
  var randomIndex = 0;
  var [flashcard, setFlashcard] = React.useState(
    params.flashcards[randomIndex]
  );
  var next = (easy: number) => {
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
    }
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
