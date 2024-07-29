export default function FlashcardsCounter(params: { count: number }) {
  return (
    <div>
      <div>
        <p>Counter: {params.count}</p>
      </div>
    </div>
  );
}
