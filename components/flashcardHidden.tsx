export default function FlashCardHidden(params: {
  front: string;
  back: string;
}) {
  return (
    <div className="m-4 p-6 bg-stone-300 max-w-sm rounded overflow-hidden shadow-lg">
      <div>{params.front}</div>
      <br />
      <div>{params.back}</div>
    </div>
  );
}
