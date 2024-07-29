"use client";
import Image from "next/image";
import SideBar from "@/components/sidebar";
import { login, createMaze } from "@/app/db";
import { useState, useEffect } from "react";
import Client from "pocketbase";

export default function NewMaze() {
  const [pb, setPb] = useState(new Client());

  useEffect(() => {
    setPb(login());
  }, []);

  var onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const target = event.target as any;
    var mazeName = target.mazeName.value;
    // TODO mazeDescription is not retrieved
    var mazeDescription = target.mazeDescription.value;
    createMaze(pb, mazeName, mazeDescription);
  };

  return (
    <main>
      <SideBar />
      <div className="p-10">
        <form
          onSubmit={onSubmit}
          className="bg-sky-300 inline-block pt-10 pl-10 pr-10 pb-6 rounded-3xl"
        >
          <div className="pb-4">
            <h1 className="text-2xl">Create a new Maze!</h1>
            <br />
            <label className="mr-12">Maze Name</label>
            <br />
            <input
              id="mazeName"
              name="mazeName"
              type="text"
              className="border-2 border-indigo-500 px-3 py-1 rounded-2xl"
            />
          </div>
          <div className="pb-4">
            <label className="mr-2">Maze Description</label>
            <br />
            <textarea
              id="mazeDescription"
              name="mazeDescription"
              className="border-2 border-indigo-500 px-3 py-1 rounded-2xl"
              rows={4}
              cols={50}
            ></textarea>
          </div>
          <button>
            <Image
              width={32}
              height={32}
              style={{ width: "auto" }}
              className="w-10 mb-2 mr-2 inline mt-1"
              src="/plus-sign-1.png"
              alt="Add New Maze"
            />
            Create
          </button>
        </form>
      </div>
    </main>
  );
}
