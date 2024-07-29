export default function MazeID({ params }: { params: { id: string } }) {
  let id = params.id;
  return (
    <main>
      <h1>Maze {id}</h1>
    </main>
  );
}
