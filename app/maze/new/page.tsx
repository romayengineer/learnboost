import SideBar from "@/components/sidebar";

export default function NewMaze() {
  return (
    <main>
      <SideBar />
      <div className="p-10">
        <form
          className="bg-sky-300 inline-block pt-10 pl-10 pr-10 pb-6 rounded-3xl"
          action="javascript:void(0);"
        >
          <div className="pb-4">
            <h1 className="text-2xl">Create a new Maze!</h1>
            <br />
            <label className="mr-12">Maze Name</label>
            <br />
            <input
              id="maze-name"
              name="maze-name"
              type="text"
              className="border-2 border-indigo-500 px-3 py-1 rounded-2xl"
            />
          </div>
          <div className="pb-4">
            <label className="mr-2">Maze Description</label>
            <br />
            <textarea
              id="maze-description"
              name="maze-description"
              className="border-2 border-indigo-500 px-3 py-1 rounded-2xl"
              rows={4}
              cols={50}
            ></textarea>
          </div>
          <button>
            <img
              className="w-10 mb-2 mr-2 inline mt-1"
              src="/plus-sign-1.png"
              alt="Add New Maze"
            ></img>
            Create
          </button>
        </form>
      </div>
    </main>
  );
}
