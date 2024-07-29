import PocketBase, { RecordModel } from "pocketbase";

export async function login() {
  const pb = new PocketBase(process.env.POCKETBASE_URL);

  await pb.admins.authWithPassword(
    process.env.DB_USER_NAME!,
    process.env.DB_PASSWORD!,
    {
      cache: "no-store",
    }
  );

  return pb;
}

export async function getMazes(pb: PocketBase): Promise<RecordModel[]> {
  return pb.collection("mazes").getFullList();
}

export async function getFlashcards(
  pb: PocketBase,
  mazeId: string
): Promise<RecordModel[]> {
  return pb.collection("flashcards").getFullList({
    filter: `mazeId.id ?= "${mazeId}"`,
  });
}
