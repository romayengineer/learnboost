"use client";
import { login, getFlashcards } from "@/app/db";
import { useState, useEffect } from "react";
import { Flashcard } from "@/app/dbTypes";
import FlashcardsStudy from "@/components/flashcardsStudy";
import { setLocalFlashcards, getLocalFlashcards } from "@/app/pbLocalStorage";

export default function StudyMazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  const [flashcards, setFlashcards] = useState([] as Array<Flashcard>);
  useEffect(() => {
    let pb = login();
    const promFlashcards = async () => {
      const awaitedFlashcards = await getFlashcards(pb, mazeId);
      const flashcardsData = awaitedFlashcards as unknown as Array<Flashcard>;
      setFlashcards(flashcardsData);
      setLocalFlashcards(awaitedFlashcards);
      console.log("DEBUG StudyMazeID flashcardsData: ", flashcardsData);
    };
    const localFlashcards = getLocalFlashcards() as unknown as Array<Flashcard>;
    setFlashcards(localFlashcards);
    console.log(
      "DEBUG StudyMazeID useEffect: setting flashcards from local ",
      localFlashcards
    );
    promFlashcards();
  }, [mazeId]);
  return (
    <main>
      <div className="flex flex-row justify-center items-center">
        <FlashcardsStudy flashcards={flashcards} />
      </div>
    </main>
  );
}
