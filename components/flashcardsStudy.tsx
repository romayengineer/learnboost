"use client";
import React from "react";
import FlashCardHidden from "@/components/flashcardHidden";
import FlashcardsCounter from "./flashcardsCounter";
import { getRecalls, login, sendRecall } from "@/app/db";
import Client from "pocketbase";
import { GroupedRecalls, RecallData, RecallsData } from "@/app/dbTypes";
import { groupRecallsByFlashcardId } from "@/app/dbUtils";
import { getHardestAndLeastTimeRecalls } from "@/app/dbUtils";
import { Flashcard } from "@/app/dbTypes";
import { getLocalRecalls } from "@/app/pbLocalStorage";

export function findFlashcardWithId(
  flashcards: Array<Flashcard>,
  flashcardId: string
): Flashcard | undefined {
  for (const arrayIndex in flashcards) {
    var flashcardData = flashcards[arrayIndex];
    if (flashcardData.id === flashcardId) {
      console.log("DEBUG findFlashcardWithId found: ", true);
      return flashcardData;
    }
  }
  console.log("DEBUG findFlashcardWithId found: ", false);
  console.log("DEBUG findFlashcardWithId flashcards: ", flashcards);
  console.log("DEBUG findFlashcardWithId flashcardId: ", flashcardId);
}

export default function FlashcardsStudy(params: {
  flashcards: Array<Flashcard>;
}) {
  const [pb, setPb] = React.useState(new Client());
  const [hardestFlashcardId, setHardestFlashcardId] = React.useState("");
  const [lastFlashcard, setLastFlashcard] = React.useState({
    id: "",
    front: "",
    back: "",
  } as Flashcard);
  const [flashcardCount, setFlashcardCount] = React.useState(1);
  const [groupedRecalls, setGroupedRecalls] = React.useState(
    {} as GroupedRecalls
  );
  const [recalls, setRecalls] = React.useState([] as RecallsData);
  if (
    lastFlashcard.id === "" &&
    hardestFlashcardId !== "" &&
    params.flashcards.length > 0
  ) {
    const newLastFlashcard = findFlashcardWithId(
      params.flashcards,
      hardestFlashcardId
    );
    if (newLastFlashcard !== undefined) {
      setLastFlashcard(newLastFlashcard);
    }
  }
  console.log("DEBUG FlashcardsStudy lastFlashcard: ", lastFlashcard);
  console.log("DEBUG FlashcardsStudy params.flashcards: ", params.flashcards);
  console.log("DEBUG FlashcardsStudy groupedRecalls: ", groupedRecalls);
  const onRecallsUpdate = (newRecalls: Array<RecallData>) => {
    console.log(
      "DEBUG FlashcardsStudy onRecallsUpdate newRecalls: ",
      newRecalls
    );
    const groupedRecallsData = groupRecallsByFlashcardId(newRecalls);
    setGroupedRecalls(groupedRecallsData);
    const hardestRecalls = getHardestAndLeastTimeRecalls(groupedRecallsData);
    if (hardestRecalls.length > 0) {
      const newHardestFlashcardId = hardestRecalls[0].flashcardId;
      setHardestFlashcardId(newHardestFlashcardId);
      const newLastFlashcard = findFlashcardWithId(
        params.flashcards,
        newHardestFlashcardId
      );
      if (newLastFlashcard !== undefined) {
        setLastFlashcard(newLastFlashcard);
      }
    }
    console.log(
      "DEBUG FlashcardsStudy onRecallsUpdate hardestRecalls: ",
      hardestRecalls
    );
  };
  React.useEffect(() => {
    const newPb = login();
    const promRecalls = async () => {
      const newRecalls = (await getRecalls(newPb)) as unknown as RecallsData;
      onRecallsUpdate(newRecalls);
      setRecalls(newRecalls);
    };
    const localRecalls = getLocalRecalls() as unknown as RecallsData;
    onRecallsUpdate(localRecalls);
    setRecalls(localRecalls);
    console.log(
      "DEBUG FlashcardsStudy useEffect: setting recalls from local ",
      localRecalls
    );
    setPb(newPb);
    promRecalls();
  }, []);
  const next = (data: RecallData) => {
    // easy goes from 0 to 3
    setFlashcardCount((prev) => prev + 1);
    console.log("DEBUG FlashcardsStudy next data: ", data);
    sendRecall(
      pb,
      data.flashcardId,
      data.timeFront,
      data.timeBack,
      data.easy
    ).catch((error) => {
      console.log("ERROR FlashcardsStudy next error: ", error);
      throw error;
    });
    setRecalls((oldRecalls) => {
      const newRecalls: Array<RecallData> = [
        ...oldRecalls,
        {
          easy: data.easy,
          flashcardId: data.flashcardId,
          timeFront: data.timeFront,
          timeBack: data.timeBack,
        },
      ];
      onRecallsUpdate(newRecalls);
      return newRecalls;
    });
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
