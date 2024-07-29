"use client";
import { login, getFlashcards } from "@/app/db";
import { useState, useEffect } from "react";
import { Flashcard } from "@/app/dbTypes";
import FlashcardsStudy from "@/components/flashcardsStudy";

export default function StudyMazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  const [flashcards, setFlashcards] = useState([] as Array<Flashcard>);
  useEffect(() => {
    let pb = login();
    const promFlashcards = async () => {
      let flashcardsData = (await getFlashcards(
        pb,
        mazeId
      )) as unknown as Array<{
        id: string;
        front: string;
        back: string;
      }>;
      setFlashcards(flashcardsData);
      console.log("DEBUG StudyMazeID flashcardsData: ", flashcardsData);
    };
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
