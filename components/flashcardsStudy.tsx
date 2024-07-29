"use client";
import React, { useEffect, useState } from "react";
import FlashCardHidden from "@/components/flashcardHidden";
import FlashcardsCounter from "./flashcardsCounter";
import { getRecalls, login, sendRecall } from "@/app/db";
import Client from "pocketbase";
import { GroupedRecalls, RecallData, RecallsData } from "@/app/dbTypes";
import { getRandomIndex, groupRecallsByFlashcardId } from "@/app/dbUtils";
import { getHardestAndLeastTimeRecalls } from "@/app/dbUtils";
import { Flashcard } from "@/app/dbTypes";

export default function FlashcardsStudy(params: {
  flashcards: Array<Flashcard>;
}) {
  const [pb, setPb] = useState(new Client());
  const [lastFlashcard, setLastFlashcard] = React.useState(
    (params.flashcards.length > 0
      ? params.flashcards[getRandomIndex(params.flashcards)]
      : {
          id: "",
          front: "",
          back: "",
        }) as Flashcard
  );
  if (lastFlashcard.id === "" && params.flashcards.length > 0) {
    setLastFlashcard(params.flashcards[getRandomIndex(params.flashcards)]);
  }
  const [flashcardCount, setFlashcardCount] = React.useState(1);
  const [groupedRecalls, setGroupedRecalls] = React.useState(
    {} as GroupedRecalls
  );
  const [recalls, setRecalls] = React.useState([] as RecallsData);
  console.log("DEBUG FlashcardsStudy: flashcard Picked ", lastFlashcard);
  console.log("DEBUG FlashcardsStudy flashcardSSSS: ", params.flashcards);
  console.log("DEBUG FlashcardsStudy GroupedRecalls: ", groupedRecalls);
  useEffect(() => {
    const newPb = login();
    const promRecalls = async () => {
      const newRecalls = (await getRecalls(newPb)) as unknown as RecallsData;
      console.log("DEBUG newRecalls: ", newRecalls);
      const groupedRecallsData = groupRecallsByFlashcardId(newRecalls);
      setGroupedRecalls(groupedRecallsData);
      const hardestRecalls = getHardestAndLeastTimeRecalls(groupedRecallsData);
      console.log("DEBUG hardestRecalls: ", hardestRecalls);
      setRecalls(newRecalls);
    };
    setPb(newPb);
    promRecalls();
  }, []);
  const next = (data: RecallData) => {
    // easy goes from 0 to 3
    var newFlashcard = lastFlashcard;
    if (params.flashcards.length > 0) {
      console.log("DEBUG flashcards.length > 1");
      while (newFlashcard.id === lastFlashcard.id) {
        console.log("DEBUG newFlashcard == flashcard >>> true");
        newFlashcard = params.flashcards[getRandomIndex(params.flashcards)];
      }
    }
    if (newFlashcard != lastFlashcard) {
      setLastFlashcard(newFlashcard);
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
        const hardestRecalls =
          getHardestAndLeastTimeRecalls(groupedRecallsData);
        console.log("DEBUG hardestRecalls: ", hardestRecalls);
        return newRecalls;
      });
    }
  };
  return (
    <main>
      <FlashcardsCounter count={flashcardCount} />
      <FlashCardHidden
        next={next}
        id={lastFlashcard.id}
        front={lastFlashcard.front}
        back={lastFlashcard.back}
      />
    </main>
  );
}
