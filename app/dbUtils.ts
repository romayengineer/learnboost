import {
    GroupedRecalls,
    GroupedRecallItem,
    RecallData,
} from "@/app/dbTypes";

export const getRandomIndex = (arrayData: Array<any>) => {
    return Math.floor(arrayData.length * Math.random());
};

/**
 * Takes an array of flashcard recall data and consolidates it into a summary
 * object. It aggregates the total time spent and total "easy" score for each
 * unique flashcard ID. This function streamlines flashcard review data, making
 * it easier to analyze performance across multiple study sessions by providing
 * a concise overview of each flashcard's cumulative review statistics.
 *
 * @param recalls all the recalls from database
 * @returns a map of flashcardId to an object with the totalTime and the
 * TotalEasy
 */
export function groupRecallsByFlashcardId(recalls: Array<RecallData>): GroupedRecalls {
    var groupedRecalls: GroupedRecalls = {};
    recalls.forEach((recall) => {
        const prevVal = groupedRecalls[recall.flashcardId] || {};
        groupedRecalls[recall.flashcardId] = {
        totalTime: (prevVal.totalTime || 0) + recall.timeBack,
        totalEasy: (prevVal.totalEasy || 0) + recall.easy,
        };
    });
    console.log("DEBUG groupRecallsByFlashcardId groupedRecalls: ", groupedRecalls);
    return groupedRecalls;
}

/**
 * Takes a GroupedRecalls object as input and transforms it into a sorted array
 * of GroupedRecallItem objects. It first converts the input object into an
 * array, then sorts this array based on the totalEasy property in ascending
 * order. It then selects the first five items from this sorted array. Finally,
 * it re-sorts these five items based on the totalTime property, again in
 * ascending order. The result is an array of up to five GroupedRecallItem
 * objects, representing flashcards that were found hardest and were studied the
 * least amount of time, potentially useful for identifying the least known and
 * least learned flashcards.
 *
 * @param groupedRecalls an object representing totalTime and totalEasy for each
 * flashcard
 * @returns a sorted array of flashcardsIds, the hardest and least time studied.
 */
export function getHardestAndLeastTimeRecalls(groupedRecalls: GroupedRecalls): Array<GroupedRecallItem> {
    var sortedRecalls: Array<GroupedRecallItem> = [];
    var lowestEasy: number = Infinity;
    for (const flashcardId in groupedRecalls) {
        const { totalEasy } = groupedRecalls[flashcardId];
        if (!lowestEasy || totalEasy < lowestEasy) lowestEasy = totalEasy;
    }
    // console.log("DEBUG getHardestAndLeastTimeRecalls lowestEasy 1: ", lowestEasy);
    for (const flashcardId in groupedRecalls) {
        const { totalTime, totalEasy } = groupedRecalls[flashcardId];
        if (totalEasy !== lowestEasy) continue;
        const newItem: GroupedRecallItem = { flashcardId, totalTime, totalEasy };
        sortedRecalls.push(newItem);
    }
    // console.log("DEBUG getHardestAndLeastTimeRecalls sortedRecalls 1: ", sortedRecalls.slice());
    if (sortedRecalls.length < 2) return sortedRecalls;
    sortedRecalls.sort((r1, r2) => r1.totalTime - r2.totalTime);
    // console.log("DEBUG getHardestAndLeastTimeRecalls sortedRecalls 2: ", sortedRecalls.slice());
    return sortedRecalls;
}