import { login, getMazes } from "../db";
import Maze from "../../components/maze";

export default async function MazePage() {
  var pb = await login();
  var mazes = await getMazes(pb);
  // TODO delete is for testing
  mazes = Array.from({ length: 15 }, () => mazes[0]);
  return (
    <main className="p-6">
      <h1>Here are all your mazes!</h1>
      <br />
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {mazes.map((maze) => {
          return <Maze mazeId={maze.id} mazeName={maze.name} />;
        })}
      </div>
    </main>
  );
}
