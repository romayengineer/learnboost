import { login, getFlashcards, getMaze } from "@/app/db";
import { redirect } from "next/navigation";
import MazeFlashcards from "@/components/mazeFlashcards";

export default async function MazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  let db = await login();
  let maze = (await getMaze(db, mazeId)) as unknown as { name: string };
  let flashcards = (await getFlashcards(db, mazeId)) as unknown as Array<{
    front: string;
    back: string;
  }>;
  if (flashcards.length === 0) {
    redirect("/not-found");
  }
  const gotoStudy = () => {
    const href = window.location.href;
    redirect(`${href}/study`);
  };
  return (
    <main className="p-10">
      <h1 className="text-2xl inline underline">{maze.name}</h1>
      <br />
      <MazeFlashcards mazeId={mazeId} flashcards={flashcards} />
    </main>
  );
}
