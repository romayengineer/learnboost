"use client";
import React, { useEffect, useState } from "react";
import FlashCardHidden from "@/components/flashcardHidden";
import FlashcardsCounter from "./flashcardsCounter";
import { getRecalls, login, sendRecall } from "@/app/db";
import Client from "pocketbase";

function groupRecallsByFlashcardId(
  recalls: Array<{
    flashcardId: string;
    timeFront: number;
    timeBack: number;
    easy: number;
  }>
): { [id: string]: { totalTime: number; totalEasy: number } } {
  var newRecalls: { [id: string]: { totalTime: number; totalEasy: number } } =
    {};
  recalls.forEach((recall) => {
    const prevVal = newRecalls[recall.flashcardId] || {};
    newRecalls[recall.flashcardId] = {
      totalTime: (prevVal.totalTime || 0) + recall.timeBack,
      totalEasy: (prevVal.totalEasy || 0) + recall.easy,
    };
  });
  console.log("DEBUG groupRecallsByFlashcardId: ", newRecalls);
  return newRecalls;
}

export default function FlashcardsStudy(params: {
  flashcards: Array<{ id: string; front: string; back: string }>;
}) {
  const [pb, setPb] = useState(new Client());
  const getRandomIndex = () => {
    return Math.floor(params.flashcards.length * Math.random());
  };
  const [randomIndex, setRandomIndex] = React.useState(getRandomIndex());
  const [flashcardCount, setFlashcardCount] = React.useState(1);
  const [recalls, setRecalls] = React.useState(
    [] as Array<{
      flashcardId: string;
      timeFront: number;
      timeBack: number;
      easy: number;
    }>
  );
  const flashcard = params.flashcards[randomIndex];
  var newRandomIndex = randomIndex;
  console.log("DEBUG FlashcardsStudy: flashcard Picked ", flashcard);
  console.log("DEBUG FlashcardsStudy flashcardSSSS: ", params.flashcards);
  useEffect(() => {
    const newPb = login();
    const primRecalls = async () => {
      const newRecalls = (await getRecalls(newPb)) as unknown as Array<{
        flashcardId: string;
        timeFront: number;
        timeBack: number;
        easy: number;
      }>;
      console.log("DEBUG newRecalls: ", newRecalls);
      groupRecallsByFlashcardId(newRecalls);
      setRecalls(newRecalls);
    };
    setPb(newPb);
    primRecalls();
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
