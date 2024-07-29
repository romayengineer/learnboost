import {
    RecallsData,
    GroupedRecalls,
    SortedRecallsByEasyAndTime,
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

export function getSortedRecallsByEasyAndTime(groupedRecalls: GroupedRecalls): SortedRecallsByEasyAndTime {
    // TODO map the groupedRecalls into an array grouped by easy and time
    return [] as SortedRecallsByEasyAndTime;
}