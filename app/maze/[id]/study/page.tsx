import { login, getFlashcards } from "@/app/db";
import FlashCardHidden from "@/components/flashcardHidden";

export default async function StudyMazeID({
  params,
}: {
  params: { id: string };
}) {
  let mazeId = params.id;
  let db = await login();
  let flashcards = await getFlashcards(db, mazeId);
  var flashcard = flashcards[0];
  return (
    <main>
      <FlashCardHidden front={flashcard.front} back={flashcard.back} />
    </main>
  );
}
