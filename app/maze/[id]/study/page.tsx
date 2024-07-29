import { loginAsync, getFlashcards } from "@/app/db";
import React from "react";
import FlashcardsStudy from "@/components/flashcardsStudy";

export default async function StudyMazeID({
  params,
}: {
  params: { id: string };
}) {
  let mazeId = params.id;
  let db = await loginAsync();
  let flashcards = (await getFlashcards(db, mazeId)) as unknown as Array<{
    id: string;
    front: string;
    back: string;
  }>;
  return (
    <main>
      <div className="flex flex-row justify-center items-center">
        <FlashcardsStudy flashcards={flashcards} />
      </div>
    </main>
  );
}
