import Link from "next/link";
import { RecordModel } from "pocketbase";

export default function FlashCard(params: {
  mazeId: string;
  mazeName: string;
}) {
  return (
    <Link href={`/maze/${params.mazeId}`}>
      <div className="p-6 bg-stone-300 max-w-sm rounded overflow-hidden shadow-lg">
        {params.mazeName}
      </div>
    </Link>
  );
}
