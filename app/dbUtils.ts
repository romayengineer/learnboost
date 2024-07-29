import {
    RecallsData,
    GroupedRecalls,
    SortedRecallsByEasyAndTime,
    GroupedRecallItem,
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
export function groupRecallsByFlashcardId(recalls: RecallsData): GroupedRecalls {
    var groupedRecalls: GroupedRecalls = {};
    recalls.forEach((recall) => {
        const prevVal = groupedRecalls[recall.flashcardId] || {};
        groupedRecalls[recall.flashcardId] = {
        totalTime: (prevVal.totalTime || 0) + recall.timeBack,
        totalEasy: (prevVal.totalEasy || 0) + recall.easy,
        };
    });
    console.log("DEBUG groupRecallsByFlashcardId: ", groupedRecalls);
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
export function getHardestAndLeastTimeRecalls(groupedRecalls: GroupedRecalls): SortedRecallsByEasyAndTime {
    var sortedRecalls: SortedRecallsByEasyAndTime = [];
    for (const flashcardId in groupedRecalls) {
        const { totalTime, totalEasy } = groupedRecalls[flashcardId];
        const newItem: GroupedRecallItem = { flashcardId, totalTime, totalEasy };
        sortedRecalls.push(newItem)
    }
    sortedRecalls.sort((r1, r2) => r1.totalEasy - r2.totalEasy);
    sortedRecalls = sortedRecalls.slice(0, 5);
    sortedRecalls.sort((r1, r2) => r1.totalTime - r2.totalTime);
    return sortedRecalls;
}