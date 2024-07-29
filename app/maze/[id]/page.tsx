"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { login, getFlashcards, getMaze } from "@/app/db";
import { notFound } from "next/navigation";
import SideBar from "@/components/sidebar";
import MazeFlashcards from "@/components/mazeFlashcards";

export default function MazeID({ params }: { params: { id: string } }) {
  let mazeId = params.id;
  const [maze, setMaze] = useState({ name: "" });
  const [flashcards, setFlashcards] = useState(
    Array<{
      front: string;
      back: string;
    }>
  );

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
      console.log("DEBUG maze: ", mazeData);
    };
    const promFlashcards = async () => {
      const flashcardsData = (await getFlashcards(
        pb,
        mazeId
      )) as unknown as Array<{
        front: string;
        back: string;
      }>;
      setFlashcards(flashcardsData);
      console.log("DEBUG flashcards: ", flashcardsData);
    };
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
