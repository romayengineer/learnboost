import { RecordModel } from "pocketbase";

type StringMap = {
    [key: string]: string
}

const models: StringMap = {
    recalls: "recalls",
    mazes: "mazes",
}

function setLocal(modelName: string, arrayData: Array<any>) {
    if (typeof window === "undefined") {
        console.log("DEBUG setLocal window: undefined");
        return;
    }
    const dataStringify = JSON.stringify(arrayData);
    window.localStorage.setItem(modelName, dataStringify);
}

function getLocal(modelName: string): Array<RecordModel> {
    if (typeof window === "undefined") {
        console.log("DEBUG getLocal window: undefined");
        return [];
    }
    var lovalString = window.localStorage.getItem(modelName) || "[]";
    var LocalValue: Array<RecordModel> = JSON.parse(lovalString);
    return LocalValue;
}

export function setLocalRecalls(recalls: Array<RecordModel>) {
    setLocal(models.recalls, recalls);
}

export function setLocalMazes(mazes: Array<RecordModel>) {
    setLocal(models.mazes, mazes);
}

export function getLocalRecalls(): Array<RecordModel> {
    return getLocal(models.recalls);
}

export function getLocalMazes(): Array<RecordModel> {
    return getLocal(models.mazes);
}