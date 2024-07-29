"use client";
import { useEffect, useState } from "react";
import { login, getMazes, getRecalls } from "../db";

import SideBar from "@/components/sidebar";
import Maze from "../../components/maze";
import { RecordModel } from "pocketbase";
import {
  setLocalRecalls,
  getLocalRecalls,
  setLocalMazes,
  getLocalMazes,
} from "../pbLocalStorage";

export default function MazePage() {
  const [mazes, setMazes] = useState(Array<RecordModel>);
  const [recalls, setRecalls] = useState(Array<RecordModel>);
  useEffect(() => {
    var pb = login();
    const promMazes = async () => {
      console.log("DEBUG MazePage promMazes");
      const awaitedMazes = await getMazes(pb);
      setMazes(awaitedMazes);
      setLocalMazes(awaitedMazes);
      console.log("DEBUG MazePage useEffect awaitedMazes: ", awaitedMazes);
    };
    const promRecalls = async () => {
      console.log("DEBUG MazePage promRecalls");
      const awaitedRecalls = await getRecalls(pb);
      setRecalls(awaitedRecalls);
      setLocalRecalls(awaitedRecalls);
      console.log("DEBUG MazePage useEffect awaitedRecalls: ", awaitedRecalls);
    };
    const localRecalls = getLocalRecalls();
    setRecalls(localRecalls);
    console.log(
      "DEBUG MazePage useEffect: setting recalls from local ",
      localRecalls
    );
    const localMazes = getLocalMazes();
    setMazes(localMazes);
    console.log(
      "DEBUG MazePage useEffect: setting mazes from local ",
      localMazes
    );
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
