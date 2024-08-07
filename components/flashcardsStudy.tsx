"use client";
import React from "react";
import FlashCardHidden from "@/components/flashcardHidden";
import { getRecalls, sendRecall } from "@/app/db";
import Client, { RecordModel } from "pocketbase";
import { RecallData } from "@/app/dbTypes";
import { groupRecallsByFlashcardId } from "@/app/dbUtils";
import { getHardestAndLeastTimeRecalls } from "@/app/dbUtils";
import { Flashcard } from "@/app/dbTypes";
import { getLocalRecalls, setLocalRecalls } from "@/app/pbLocalStorage";

export function findFlashcardWithId(
  flashcards: Array<Flashcard>,
  flashcardId: string
): Flashcard | undefined {
  for (const arrayIndex in flashcards) {
    var flashcardData = flashcards[arrayIndex];
    if (flashcardData.id === flashcardId) {
      return flashcardData;
    }
  }
}

export default function FlashcardsStudy(params: {
  pb: Client;
  flashcards: Array<Flashcard>;
}) {
  const [lastFlashcard, setLastFlashcard] = React.useState({} as Flashcard);
  const [_, setRecalls] = React.useState([] as Array<RecallData>);
  console.log("DEBUG FlashcardsStudy lastFlashcard: ", lastFlashcard);
  // updates lastFlashcard from recalls
  const onRecallsUpdate = (newRecalls: Array<RecallData>) => {
    const groupedRecallsData = groupRecallsByFlashcardId(newRecalls);
    const hardestRecalls = getHardestAndLeastTimeRecalls(groupedRecallsData);
    if (hardestRecalls.length == 0) return;
    console.log(
      "DEBUG FlashcardsStudy hardestRecalls: ",
      hardestRecalls.slice()
    );
    const newHardestFlashcardId = hardestRecalls[0].flashcardId;
    const newLastFlashcard = findFlashcardWithId(
      params.flashcards,
      newHardestFlashcardId
    );
    if (newLastFlashcard !== undefined) {
      setLastFlashcard(newLastFlashcard);
    }
  };
  const onUpdateSetRecalls = (newRecalls: Array<RecallData>, from: string) => {
    if (newRecalls.length < 1) return;
    console.log(
      "DEBUG FlashcardsStudy useEffect: setting recalls from ",
      from,
      newRecalls.slice()
    );
    onRecallsUpdate(newRecalls);
    setRecalls(newRecalls);
  };
  const loadRecallsAndUpdateLocal = () => {
    /**
     * We need to set the lastFlashcards and for that we need
     * to have the flashcards Array if not there is no need to get the recalls
     * as having no flashcards the lastFlashcards will be null
     */
    if (params.flashcards.length == 0) return;
    const promRecalls = async () => {
      const newRecalls = await getRecalls(params.pb);
      setLocalRecalls(newRecalls);
      onUpdateSetRecalls(
        newRecalls as Array<unknown> as Array<RecallData>,
        "Database"
      );
    };
    const localRecalls = getLocalRecalls() as unknown as Array<RecallData>;
    onUpdateSetRecalls(localRecalls, "LocalStorage");
    promRecalls();
  };
  React.useEffect(loadRecallsAndUpdateLocal, [params.flashcards.length]);
  const next = (newRecall: RecallData) => {
    console.log("DEBUG FlashcardsStudy next newRecall: ", newRecall);
    sendRecall(
      params.pb,
      newRecall.flashcardId,
      newRecall.timeFront,
      newRecall.timeBack,
      newRecall.easy
    );
    setRecalls((oldRecalls) => {
      const newRecalls = [...oldRecalls, newRecall];
      onRecallsUpdate(newRecalls);
      setLocalRecalls(newRecalls as Array<unknown> as Array<RecordModel>);
      return newRecalls;
    });
  };
  return (
    <main>
      <FlashCardHidden
        next={next}
        id={lastFlashcard.id}
        front={lastFlashcard.front}
        back={lastFlashcard.back}
      />
    </main>
  );
}
