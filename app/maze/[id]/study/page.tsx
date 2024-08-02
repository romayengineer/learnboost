"use client";
import { login, getFlashcards } from "@/app/db";
import React from "react";
import { Flashcard } from "@/app/dbTypes";
import FlashcardsStudy from "@/components/flashcardsStudy";
import { setLocalFlashcards, getLocalFlashcards } from "@/app/pbLocalStorage";
import Client from "pocketbase";

export default function StudyMazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  const [pb, setPb] = React.useState(new Client());
  const [flashcards, setFlashcards] = React.useState([] as Array<Flashcard>);
  React.useEffect(() => {
    let pb = login();
    const promFlashcards = async () => {
      const awaitedFlashcards = await getFlashcards(pb, mazeId);
      const flashcardsData = awaitedFlashcards as unknown as Array<Flashcard>;
      setFlashcards(flashcardsData);
      setLocalFlashcards(awaitedFlashcards);
      console.log("DEBUG StudyMazeID flashcardsData: ", flashcardsData.slice());
    };
    setPb(pb);
    const localFlashcards = getLocalFlashcards() as unknown as Array<Flashcard>;
    setFlashcards(localFlashcards);
    console.log(
      "DEBUG StudyMazeID useEffect: setting flashcards from local ",
      localFlashcards.slice()
    );
    promFlashcards();
  }, [mazeId]);
  return (
    <main>
      <div className="flex flex-row justify-center items-center">
        <FlashcardsStudy pb={pb} flashcards={flashcards} />
      </div>
    </main>
  );
}
