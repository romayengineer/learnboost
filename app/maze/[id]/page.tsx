"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { login, getFlashcards, getMaze } from "@/app/db";
import { notFound } from "next/navigation";
import SideBar from "@/components/sidebar";
import MazeFlashcards from "@/components/mazeFlashcards";
import { Flashcard } from "@/app/dbTypes";
import {
  getLocalFlashcards,
  getLocalMaze,
  setLocalFlashcards,
} from "@/app/pbLocalStorage";

export default function MazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  const [maze, setMaze] = useState({ name: "" });
  const [flashcards, setFlashcards] = useState([] as Array<Flashcard>);

  useEffect(() => {
    let pb = login();
    // TODO the try catch block is commented because vercel throws
    // Dynamic server usage: no-store fetch
    const promMaze = async () => {
      const mazeData = (await getMaze(pb, mazeId)) as unknown as {
        name: string;
      };
      if (mazeData.name === undefined) {
        notFound();
      }
      setMaze(mazeData);
      console.log("DEBUG MazeID mazeData: ", mazeData);
    };
    const promFlashcards = async () => {
      const awaitedFlashcards = await getFlashcards(pb, mazeId);
      const flashcardsData = awaitedFlashcards as unknown as Array<Flashcard>;
      setFlashcards(flashcardsData);
      setLocalFlashcards(awaitedFlashcards);
      console.log("DEBUG MazeID flashcardsData: ", flashcardsData.slice());
    };
    const localFlashcards = getLocalFlashcards() as unknown as Array<Flashcard>;
    setFlashcards(localFlashcards);
    console.log(
      "DEBUG MazeID useEffect: setting flashcards from local ",
      localFlashcards.slice()
    );
    const localMaze = getLocalMaze(mazeId);
    if (localMaze.length === 1) {
      setMaze(localMaze[0] as unknown as { name: string });
      console.log(
        "DEBUG MazeID useEffect: setting maze from local ",
        localMaze[0]
      );
    }
    promMaze();
    promFlashcards();
  }, [mazeId]);
  return (
    <main>
      <SideBar />
      <div className="p-10">
        <h1 className="text-2xl inline underline">{maze.name}</h1>
        <a href="/maze/new" className="inline">
          <Image
            width={32}
            height={32}
            style={{ width: "auto" }}
            className="w-10 mb-2 mr-2 inline ml-10"
            src="/plus-sign-1.png"
            alt="Add New Maze"
          />
          <span className="text-2xl inline-block">Create Maze</span>
        </a>
        <MazeFlashcards mazeId={mazeId} flashcards={flashcards} />
      </div>
    </main>
  );
}
