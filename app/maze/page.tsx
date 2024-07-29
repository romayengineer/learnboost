import { login, getMazes } from "../db";
import Link from "next/link";

export default async function Maze() {
  var pb = await login();
  var mazes = await getMazes(pb);
  return (
    <main className="p-6">
      <h1>Here are all your mazes!</h1>
      <br />
      {mazes.map((maze) => {
        return (
          <div className="p-6 bg-cyan-300 max-w-sm rounded overflow-hidden shadow-lg">
            <Link href={`/maze/${maze.id}`}>{maze.name}</Link>
          </div>
        );
      })}
    </main>
  );
}
