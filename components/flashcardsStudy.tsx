"use client";
import React from "react";
import FlashCardHidden from "@/components/flashcardHidden";
import { getRecalls, login, sendRecall } from "@/app/db";
import Client from "pocketbase";
import { RecallData, RecallsData } from "@/app/dbTypes";
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
      return flashcardData;
    }
  }
}

export default function FlashcardsStudy(params: {
  flashcards: Array<Flashcard>;
}) {
  /**
   * I only need three veriables
   * the flashcards
   * the recalls
   * and the lastFlashcard (the one that is shown)
   */
  const [pb, setPb] = React.useState(new Client());
  const [lastFlashcard, setLastFlashcard] = React.useState({} as Flashcard);
  const [recalls, setRecalls] = React.useState([] as RecallsData);
  console.log("DEBUG FlashcardsStudy lastFlashcard: ", lastFlashcard);
  console.log("DEBUG FlashcardsStudy params.flashcards: ", params.flashcards);
  // updates lastFlashcard from recalls
  const onRecallsUpdate = (newRecalls: Array<RecallData>) => {
    console.log(
      "DEBUG FlashcardsStudy onRecallsUpdate newRecalls: ",
      newRecalls
    );
    const groupedRecallsData = groupRecallsByFlashcardId(newRecalls);
    const hardestRecalls = getHardestAndLeastTimeRecalls(groupedRecallsData);
    if (hardestRecalls.length == 0) return;
    const newHardestFlashcardId = hardestRecalls[0].flashcardId;
    const newLastFlashcard = findFlashcardWithId(
      params.flashcards,
      newHardestFlashcardId
    );
    if (newLastFlashcard !== undefined) {
      setLastFlashcard(newLastFlashcard);
    }
    console.log(
      "DEBUG FlashcardsStudy onRecallsUpdate hardestRecalls: ",
      hardestRecalls
    );
  };
  // get the recalls
  React.useEffect(() => {
    /**
     * We need to set the lastFlashcards and for that we need
     * to have the flashcards Array if not there is no need to get the recalls
     * as having no flashcards the lastFlashcards will be null
     */
    if (params.flashcards.length == 0) return;
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
  }, [params.flashcards.length]);
  const next = (data: RecallData) => {
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
      <FlashCardHidden
        next={next}
        id={lastFlashcard.id}
        front={lastFlashcard.front}
        back={lastFlashcard.back}
      />
    </main>
  );
}
