import { RecordModel } from "pocketbase";

function setLocal(modelName: string, arrayData: Array<any>) {
    if (typeof window === "undefined") {
        console.log("DEBUG setLocal window: undefined");
        return;
    }
    const dataStringify = JSON.stringify(arrayData);
    window.localStorage.setItem(modelName, dataStringify);
}

export function setLocalRecalls(recalls: Array<RecordModel>) {
    setLocal("recalls", recalls);
}

export function setLocalMazes(mazes: Array<RecordModel>) {
    setLocal("mazes", mazes);
}

export function getLocalRecalls(): Array<RecordModel> {
    if (typeof window === "undefined") {
        console.log("DEBUG getLocalRecalls window: undefined");
        return [];
    }
    var lovalValue = window.localStorage.getItem("recalls") || "[]";
    var localRecalls: Array<RecordModel> = JSON.parse(lovalValue);
    return localRecalls;
}

export function getLocalMazes(): Array<RecordModel> {
    if (typeof window === "undefined") {
        console.log("DEBUG getLocalMazes window: undefined");
        return [];
    }
    var lovalValue = window.localStorage.getItem("mazes") || "[]";
    var localMazes: Array<RecordModel> = JSON.parse(lovalValue);
    return localMazes;
}