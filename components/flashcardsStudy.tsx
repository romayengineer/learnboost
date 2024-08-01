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

function setLastFlashcardIfFound(
  lastFlashcard: Flashcard,
  hardestFlashcardId: string,
  flashcards: Array<Flashcard>,
  setLastFlashcard: React.Dispatch<React.SetStateAction<Flashcard>>
) {
  if (!lastFlashcard.id && hardestFlashcardId !== "" && flashcards.length > 0) {
    const newLastFlashcard = findFlashcardWithId(
      flashcards,
      hardestFlashcardId
    );
    if (newLastFlashcard !== undefined) {
      setLastFlashcard(newLastFlashcard);
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
  const [hardestFlashcardId, setHardestFlashcardId] = React.useState("");
  const [lastFlashcard, setLastFlashcard] = React.useState({} as Flashcard);
  const [recalls, setRecalls] = React.useState([] as RecallsData);
  setLastFlashcardIfFound(
    lastFlashcard,
    hardestFlashcardId,
    params.flashcards,
    setLastFlashcard
  );
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
  // get the recalls
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
