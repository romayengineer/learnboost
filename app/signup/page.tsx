export default function Home() {
  return (
    <main>
      <div className="min-h-screen flex flex-row justify-center">
        <form>
          <div style={{ height: "150px" }}></div>
          <h1 className="text-2xl mb-4">Register</h1>
          <input
            style={{ width: "300px" }}
            className="mb-6 p-2 rounded-full"
            type="text"
            name="username"
            placeholder="Username..."
          />
          <br />
          <input
            style={{ width: "300px" }}
            className="mb-6 p-2 rounded-full"
            type="text"
            name="password"
            placeholder="Password..."
          />
          <br />
          <div className="flex flex-row justify-center">
            <button className="bg-sky-300 pl-6 pr-6 pt-2 pb-2 rounded-2xl">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
