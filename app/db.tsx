import PocketBase, { RecordModel } from "pocketbase";

export async function loginAsync() {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL);

  await pb.admins.authWithPassword(
    process.env.NEXT_PUBLIC_DB_USER_NAME!,
    process.env.NEXT_PUBLIC_DB_PASSWORD!,
    {
      cache: "no-store",
      // to avoid vercel error
      // Dynamic server usage: no-store fetch
      next: { revalidate: 0 },
    }
  );

  return pb;
}

export function login() {
  // TODO remove this is for testing in Vercel
  var NEXT_PUBLIC_PB_URL = process.env.NEXT_PUBLIC_PB_URL || "dummy.com";
  var NEXT_PUBLIC_DB_USER_NAME =
    process.env.NEXT_PUBLIC_DB_USER_NAME || "dummyUsername";
  var NEXT_PUBLIC_DB_PASSWORD =
    process.env.NEXT_PUBLIC_DB_PASSWORD || "dummyPassword";

  const pb = new PocketBase(NEXT_PUBLIC_PB_URL);

  pb.admins.authWithPassword(
    NEXT_PUBLIC_DB_USER_NAME!,
    NEXT_PUBLIC_DB_PASSWORD!,
    {
      cache: "no-store",
    }
  );

  return pb;
}

export function createMaze(
  pb: PocketBase,
  name: string,
  description: string
): Promise<RecordModel> {
  return pb.collection("mazes").create({ name: name, desciption: description });
}

export async function getMazes(pb: PocketBase): Promise<RecordModel[]> {
  return pb.collection("mazes").getFullList();
}

export async function getMaze(
  pb: PocketBase,
  mazeId: string
): Promise<RecordModel[]> {
  return pb.collection("mazes").getOne(mazeId);
}

export async function getFlashcards(
  pb: PocketBase,
  mazeId: string
): Promise<RecordModel[]> {
  return pb.collection("flashcards").getFullList({
    filter: `mazeId.id ?= "${mazeId}"`,
  });
}

export function sendRecall(
  pb: PocketBase,
  flashcardId: string,
  timeFront: number,
  timeBack: number,
  easy: number
): Promise<RecordModel[]> {
  return pb.collection("recalls").create({
    flashcardId: flashcardId,
    timeFront: timeFront,
    timeBack: timeBack,
    easy: easy,
  });
}

// TODO filter by day
export function getRecall(pb: PocketBase): Promise<RecordModel[]> {
  return pb.collection("recalls").getFullList();
}
