import Link from "next/link";

export default function Maze(params: { mazeId: string; mazeName: string }) {
  return (
    <Link href={`/maze/${params.mazeId}`}>
      <div className="p-6 bg-sky-300 max-w-sm rounded overflow-hidden shadow-lg">
        {params.mazeName}
      </div>
    </Link>
  );
}
