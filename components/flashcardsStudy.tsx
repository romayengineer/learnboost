"use client";
import React, { useEffect, useState } from "react";
import FlashCardHidden from "@/components/flashcardHidden";
import FlashcardsCounter from "./flashcardsCounter";
import { login, sendRecall } from "@/app/db";
import Client from "pocketbase";

export default function FlashcardsStudy(params: {
  flashcards: Array<{ id: string; front: string; back: string }>;
}) {
  const [pb, setPb] = useState(new Client());
  const getRandomIndex = () => {
    return Math.floor(params.flashcards.length * Math.random());
  };
  const [randomIndex, setRandomIndex] = React.useState(getRandomIndex());
  const [flashcardCount, setFlashcardCount] = React.useState(1);
  const flashcard = params.flashcards[randomIndex];
  var newRandomIndex = randomIndex;
  console.log("DEBUG FlashcardsStudy: flashcard Picked ", flashcard);
  console.log("DEBUG FlashcardsStudy flashcardSSSS: ", params.flashcards);
  useEffect(() => {
    setPb(login());
  }, []);
  const next = (
    easy: number,
    flashcardId: string,
    timeFront: number,
    timeBack: number
  ) => {
    // easy goes from 0 to 3
    var newFlashcard = flashcard;
    if (params.flashcards.length > 1) {
      console.log("flashcards.length > 1");
      while (newFlashcard.id === flashcard.id) {
        console.log("newFlashcard == flashcard >>> true");
        newRandomIndex = getRandomIndex();
        newFlashcard = params.flashcards[newRandomIndex];
      }
    }
    if (newFlashcard != flashcard) {
      setRandomIndex(newRandomIndex);
      console.log(`setRandomIndex to ${newRandomIndex}`);
      setFlashcardCount((prev) => prev + 1);
      console.log("sendRecall: ", { flashcardId, timeFront, timeBack, easy });
      sendRecall(pb, flashcardId, timeFront, timeBack, easy).catch((error) => {
        console.log("ERROR sendRecall: ", error);
        throw error;
      });
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
