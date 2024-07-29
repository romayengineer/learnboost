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
  var groupedRecalls: {
    [id: string]: { totalTime: number; totalEasy: number };
  } = {};
  recalls.forEach((recall) => {
    const prevVal = groupedRecalls[recall.flashcardId] || {};
    groupedRecalls[recall.flashcardId] = {
      totalTime: (prevVal.totalTime || 0) + recall.timeBack,
      totalEasy: (prevVal.totalEasy || 0) + recall.easy,
    };
  });
  console.log("DEBUG groupRecallsByFlashcardId: ", groupedRecalls);
  return groupedRecalls;
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
  const [groupedRecalls, setGroupedRecalls] = React.useState(
    {} as { [id: string]: { totalTime: number; totalEasy: number } }
  );
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
  console.log("DEBUG FlashcardsStudy GroupedRecalls: ", groupedRecalls);
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
      const groupedRecallsData = groupRecallsByFlashcardId(newRecalls);
      setGroupedRecalls(groupedRecallsData);
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
      console.log("DEBUG flashcards.length > 1");
      while (newFlashcard.id === flashcard.id) {
        console.log("DEBUG newFlashcard == flashcard >>> true");
        newRandomIndex = getRandomIndex();
        newFlashcard = params.flashcards[newRandomIndex];
      }
    }
    if (newFlashcard != flashcard) {
      setRandomIndex(newRandomIndex);
      console.log(`DEBUG setRandomIndex to ${newRandomIndex}`);
      setFlashcardCount((prev) => prev + 1);
      console.log("DEBUG sendRecall: ", {
        flashcardId,
        timeFront,
        timeBack,
        easy,
      });
      sendRecall(pb, flashcardId, timeFront, timeBack, easy).catch((error) => {
        console.log("ERROR sendRecall: ", error);
        throw error;
      });
      setRecalls((oldRecalls) => {
        const newRecalls = [
          ...oldRecalls,
          {
            easy,
            flashcardId,
            timeFront,
            timeBack,
          },
        ];
        console.log("DEBUG newRecalls: ", newRecalls);
        return newRecalls;
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
