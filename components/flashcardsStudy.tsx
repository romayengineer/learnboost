"use client";
import React from "react";
import FlashCardHidden from "@/components/flashcardHidden";
import { getRecalls, sendRecall } from "@/app/db";
import Client from "pocketbase";
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
    console.log("DEBUG FlashcardsStudy hardestRecalls: ", hardestRecalls);
    const newHardestFlashcardId = hardestRecalls[0].flashcardId;
    const newLastFlashcard = findFlashcardWithId(
      params.flashcards,
      newHardestFlashcardId
    );
    if (newLastFlashcard !== undefined) {
      setLastFlashcard(newLastFlashcard);
    }
  };
  // get the recalls
  React.useEffect(() => {
    /**
     * We need to set the lastFlashcards and for that we need
     * to have the flashcards Array if not there is no need to get the recalls
     * as having no flashcards the lastFlashcards will be null
     */
    if (params.flashcards.length == 0) return;
    const promRecalls = async () => {
      const _newRecalls = await getRecalls(params.pb);
      console.log(
        "DEBUG FlashcardsStudy useEffect: setting recalls from database ",
        _newRecalls
      );
      setLocalRecalls(_newRecalls);
      const newRecalls = _newRecalls as Array<unknown> as Array<RecallData>;
      onRecallsUpdate(newRecalls);
      setRecalls(newRecalls);
    };
    const localRecalls = getLocalRecalls() as unknown as Array<RecallData>;
    if (localRecalls.length > 0) {
      onRecallsUpdate(localRecalls);
      setRecalls(localRecalls);
      console.log(
        "DEBUG FlashcardsStudy useEffect: setting recalls from local ",
        localRecalls
      );
    }
    promRecalls();
  }, [params.flashcards.length]);
  const next = (data: RecallData) => {
    console.log("DEBUG FlashcardsStudy next data: ", data);
    sendRecall(
      params.pb,
      data.flashcardId,
      data.timeFront,
      data.timeBack,
      data.easy
    ).catch((error) => {
      console.log("ERROR FlashcardsStudy next error: ", error);
      throw error;
    });
    setRecalls((oldRecalls) => {
      const newRecall = {
        easy: data.easy,
        flashcardId: data.flashcardId,
        timeFront: data.timeFront,
        timeBack: data.timeBack,
      };
      const newRecalls = [...oldRecalls, newRecall];
      onRecallsUpdate(newRecalls);
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
