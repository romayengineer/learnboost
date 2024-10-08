"use client";
import FlashCard from "@/components/flashcard";

export default function MazeFlashcards(params: {
  mazeId: string;
  flashcards: Array<{ front: string; back: string }>;
}) {
  const flashcards = params.flashcards;
  return (
    <div className="mt-10">
      {flashcards.length > 0 && (
        <a
          className="text-xl ml-4 pl-6 pr-6 pt-2 pb-2 rounded-full bg-blue-300"
          href={`/maze/${params.mazeId}/study`}
        >
          Study!
        </a>
      )}
      <div className="mt-6 grid gap-4 rid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {flashcards.map((flashcard) => {
          return (
            <FlashCard
              key={Math.round(1000 * Math.random())}
              front={flashcard.front}
              back={flashcard.back}
            />
          );
        })}
      </div>
    </div>
  );
}
