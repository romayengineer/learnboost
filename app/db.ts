import PocketBase, { RecordModel } from "pocketbase";

// TODO remove this is for testing in Vercel
var NEXT_PUBLIC_PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://dummy.com";
var NEXT_PUBLIC_DB_USER_NAME =
  process.env.NEXT_PUBLIC_DB_USER_NAME || "dummyUsername";
var NEXT_PUBLIC_DB_PASSWORD =
  process.env.NEXT_PUBLIC_DB_PASSWORD || "dummyPassword";

/**
 * Login should only be called on client side components
 * given that server side components do not support cache: "no-store"
 * @returns
 */
export function login() {
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

export function getMazes(pb: PocketBase): Promise<RecordModel[]> {
  return pb.collection("mazes").getFullList();
}

export function getMaze(
  pb: PocketBase,
  mazeId: string
): Promise<RecordModel[]> {
  return pb.collection("mazes").getOne(mazeId);
}

export function getFlashcards(
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
): Promise<RecordModel> {
  const data = {
    flashcardId: flashcardId,
    timeFront: timeFront,
    timeBack: timeBack,
    easy: easy,
  };
  return pb
    .collection("recalls")
    .create(data)
    .catch((error) => {
      console.error("Error: ", error);
      console.error("Error Args: ", data);
      throw error;
    });
}

// TODO filter by day
export function getRecall(pb: PocketBase): Promise<RecordModel[]> {
  return pb.collection("recalls").getFullList();
}
