import { RecordModel } from "pocketbase";

export function setLocalRecalls(recalls: Array<RecordModel>) {
    if (typeof window === "undefined") {
      console.log("DEBUG setLocalRecalls window: undefined");
      return;
    }
    const recallsStringify = JSON.stringify(recalls);
    window.localStorage.setItem("recalls", recallsStringify);
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

export function setLocalMazes(mazes: Array<RecordModel>) {
    if (typeof window === "undefined") {
      console.log("DEBUG setLocalMazes window: undefined");
      return;
    }
    const mazesStringify = JSON.stringify(mazes);
    window.localStorage.setItem("mazes", mazesStringify);
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