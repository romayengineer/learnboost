import { login, getFlashcards } from "@/app/db";
import { redirect } from "next/navigation";
import FlashCard from "@/components/flashcard";

export default async function MazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  let db = await login();
  let flashcards = await getFlashcards(db, mazeId);
  if (flashcards.length === 0) {
    redirect("/not-found");
  }
  return (
    <main>
      <h1>Maze {mazeId}</h1>
      <div className="grid gap-4 rid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {flashcards.map((flashcard) => {
          return <FlashCard front={flashcard.front} back={flashcard.back} />;
        })}
      </div>
    </main>
  );
}
