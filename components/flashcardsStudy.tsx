"use client";
import React, { useEffect, useState } from "react";
import FlashCardHidden from "@/components/flashcardHidden";
import FlashcardsCounter from "./flashcardsCounter";
import { getRecalls, login, sendRecall } from "@/app/db";
import Client from "pocketbase";
import { GroupedRecalls, RecallData, RecallsData } from "@/app/dbTypes";
import { getRandomIndex, groupRecallsByFlashcardId } from "@/app/dbUtils";
import { getSortedRecallsByEasyAndTime } from "@/app/dbUtils";

export default function FlashcardsStudy(params: {
  flashcards: Array<{ id: string; front: string; back: string }>;
}) {
  const [pb, setPb] = useState(new Client());
  const [randomIndex, setRandomIndex] = React.useState(
    getRandomIndex(params.flashcards)
  );
  const [flashcardCount, setFlashcardCount] = React.useState(1);
  const [groupedRecalls, setGroupedRecalls] = React.useState(
    {} as GroupedRecalls
  );
  const [recalls, setRecalls] = React.useState([] as RecallsData);
  const flashcard = params.flashcards[randomIndex];
  var newRandomIndex = randomIndex;
  console.log("DEBUG FlashcardsStudy: flashcard Picked ", flashcard);
  console.log("DEBUG FlashcardsStudy flashcardSSSS: ", params.flashcards);
  console.log("DEBUG FlashcardsStudy GroupedRecalls: ", groupedRecalls);
  useEffect(() => {
    const newPb = login();
    const promRecalls = async () => {
      const newRecalls = (await getRecalls(newPb)) as unknown as RecallsData;
      console.log("DEBUG newRecalls: ", newRecalls);
      const groupedRecallsData = groupRecallsByFlashcardId(newRecalls);
      setGroupedRecalls(groupedRecallsData);
      const sortedRecalls = getSortedRecallsByEasyAndTime(groupedRecallsData);
      console.log("DEBUG sortedRecalls: ", sortedRecalls);
      setRecalls(newRecalls);
    };
    setPb(newPb);
    promRecalls();
  }, []);
  const next = (data: RecallData) => {
    // easy goes from 0 to 3
    var newFlashcard = flashcard;
    if (params.flashcards.length > 1) {
      console.log("DEBUG flashcards.length > 1");
      while (newFlashcard.id === flashcard.id) {
        console.log("DEBUG newFlashcard == flashcard >>> true");
        newRandomIndex = getRandomIndex(params.flashcards);
        newFlashcard = params.flashcards[newRandomIndex];
      }
    }
    if (newFlashcard != flashcard) {
      setRandomIndex(newRandomIndex);
      console.log(`DEBUG setRandomIndex to ${newRandomIndex}`);
      setFlashcardCount((prev) => prev + 1);
      console.log("DEBUG sendRecall: ", data);
      sendRecall(
        pb,
        data.flashcardId,
        data.timeFront,
        data.timeBack,
        data.easy
      ).catch((error) => {
        console.log("ERROR sendRecall: ", error);
        throw error;
      });
      setRecalls((oldRecalls) => {
        const newRecalls = [
          ...oldRecalls,
          {
            easy: data.easy,
            flashcardId: data.flashcardId,
            timeFront: data.timeFront,
            timeBack: data.timeBack,
          },
        ];
        console.log("DEBUG newRecalls: ", newRecalls);
        const groupedRecallsData = groupRecallsByFlashcardId(newRecalls);
        setGroupedRecalls(groupedRecallsData);
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
