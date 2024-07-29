import { loginAsync, getMazes, getRecall } from "../db";

import SideBar from "@/components/sidebar";
import Maze from "../../components/maze";

export default async function MazePage() {
  var pb = await loginAsync();
  var mazes = await getMazes(pb);
  var recalls = await getRecall(pb);
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
