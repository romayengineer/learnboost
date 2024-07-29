export default function NewMaze() {
  return (
    <main className="p-10">
      <h1>Create a new Maze!</h1>
      <br />
      <form>
        <div className="pb-4">
          <label className="mr-12">Maze Name</label>
          <input
            className="border-2 border-indigo-500"
            type="text"
            name="name"
          />
        </div>
        <div className="pb-4">
          <label className="mr-2">Maze Description</label>
          <input
            className="border-2 border-indigo-500"
            type="text"
            name="description"
          />
        </div>
      </form>
    </main>
  );
}
