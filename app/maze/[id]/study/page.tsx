"use client";
import { login, getFlashcards } from "@/app/db";
import { useState, useEffect } from "react";
import FlashcardsStudy from "@/components/flashcardsStudy";

export default function StudyMazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  const [flashcards, setFlashcards] = useState([
    { id: "", front: "", back: "" },
  ]);
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
      console.log("DEBUG flashcards: ", flashcardsData);
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
