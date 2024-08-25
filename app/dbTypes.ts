
export type Flashcard = {
    id: string;
    front: string;
    back: string;
};

export type Config = {
    name: string;
    value: string;
};

export type GroupedRecalls = {
    [id: string]: {
        totalTime: number;
        totalEasy: number
    };
};

export type GroupedRecallItem = {
    flashcardId: string,
    totalTime: number,
    totalEasy: number,
}

export type RecallData = {
    flashcardId: string;
    timeFront: number;
    timeBack: number;
    easy: number;
};