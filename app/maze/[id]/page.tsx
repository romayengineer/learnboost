import { login, getFlashcards } from "@/app/db";

export default async function MazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  let db = await login();
  let flashcards = await getFlashcards(db, mazeId);
  return (
    <main>
      <h1>Maze {mazeId}</h1>
      <div className="grid gap-4 rid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {flashcards.map((flashcard) => {
          return (
            <div className="m-4 p-6 bg-stone-300 max-w-sm rounded overflow-hidden shadow-lg">
              <div>{flashcard.front}</div>
              <br />
              <div>{flashcard.back}</div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
