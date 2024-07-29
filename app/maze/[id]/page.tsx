import { login, getFlashcards } from "@/app/db";

export default async function MazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  let db = await login();
  let flashcards = await getFlashcards(db, mazeId);
  return (
    <main>
      <h1>Maze {mazeId}</h1>
      <div>
        {flashcards.map((flashcard) => {
          return (
            <div className="m-4 p-6 bg-cyan-300 max-w-sm rounded overflow-hidden shadow-lg">
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
