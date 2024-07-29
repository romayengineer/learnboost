"use client";
import { useEffect, useState } from "react";
import { login, getMazes, getRecalls } from "../db";

import SideBar from "@/components/sidebar";
import Maze from "../../components/maze";
import { RecordModel } from "pocketbase";

export default function MazePage() {
  const [mazes, setMazes] = useState(Array<RecordModel>);
  const [recalls, setRecalls] = useState(Array<RecordModel>);
  useEffect(() => {
    var pb = login();
    const promMazes = async () => {
      console.log("DEBUG MazePage promMazes");
      setMazes(await getMazes(pb));
    };
    const promRecalls = async () => {
      console.log("DEBUG MazePage promRecalls");
      setRecalls(await getRecalls(pb));
    };
    promMazes();
    promRecalls();
  }, []);
  return (
    <main>
      <SideBar />
      <div className="p-6">
        <h1 className="text-2xl">Here are all your mazes!</h1>
        <br />
        <h1 className="text-xl">
          You have studied {recalls.length} flashcards
        </h1>
        <br />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {mazes.map((maze) => {
            return (
              <Maze
                key={maze.id + Math.round(100 * Math.random())}
                mazeId={maze.id}
                mazeName={maze.name}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
