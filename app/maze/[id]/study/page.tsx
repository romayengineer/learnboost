import { login, getFlashcards } from "@/app/db";
import React from "react";
import FlashcardsStudy from "@/components/flashcardsStudy";

export default async function StudyMazeID({
  params,
}: {
  params: { id: string };
}) {
  let mazeId = params.id;
  let db = await login();
  let flashcards = (await getFlashcards(db, mazeId)) as unknown as Array<{
    front: string;
    back: string;
  }>;
  return (
    <main>
      <FlashcardsStudy flashcards={flashcards} />
    </main>
  );
}
