export default function EasyButtons(params: { next: (easy: number) => void }) {
  // Levels of difficulty:
  // Easy
  // Medium
  // Challenging
  // Hard
  return (
    <div
      className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
      style={{ minHeight: "50px" }}
    >
      <button
        type="button"
        onClick={() => params.next(0)}
        style={{ width: "140px" }}
        className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Easy
      </button>
      <button
        type="button"
        onClick={() => params.next(1)}
        style={{ width: "140px" }}
        className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Medium
      </button>
      <button
        type="button"
        onClick={() => params.next(2)}
        style={{ width: "140px" }}
        className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Challenging
      </button>
      <button
        type="button"
        onClick={() => params.next(3)}
        style={{ width: "140px" }}
        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Hard
      </button>
    </div>
  );
}
