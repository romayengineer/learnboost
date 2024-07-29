import { loginAsync, getFlashcards, getMaze } from "@/app/db";
import { notFound } from "next/navigation";
import SideBar from "@/components/sidebar";
import MazeFlashcards from "@/components/mazeFlashcards";

export default async function MazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  let db = await loginAsync();
  let maze = null;
  let flashcards: Array<{
    front: string;
    back: string;
  }> = [];
  try {
    maze = (await getMaze(db, mazeId)) as unknown as { name: string };
    if (maze.name === undefined) {
      notFound();
    }
    flashcards = (await getFlashcards(db, mazeId)) as unknown as Array<{
      front: string;
      back: string;
    }>;
  } catch (e) {
    notFound();
  }
  return (
    <main>
      <SideBar />
      <div className="p-10">
        <h1 className="text-2xl inline underline">{maze.name}</h1>
        <a href="/maze/new" className="inline">
          <img
            className="w-10 mb-2 mr-2 inline ml-10"
            src="/plus-sign-1.png"
            alt="Add New Maze"
          ></img>
          <span className="text-2xl inline-block">Create Maze</span>
        </a>
        <MazeFlashcards mazeId={mazeId} flashcards={flashcards} />
      </div>
    </main>
  );
}
