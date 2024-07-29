import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="min-h-screen">
        <div style={{ height: "100px" }}></div>
        <div className="">
          <Image
            width={500}
            height={500}
            style={{ width: "auto" }}
            className="ml-10 float-left"
            src="/studying-reading-1.webp"
            alt="Studying Reading"
          />
          <h1 className="text-3xl">Master Any Subject in Record Time</h1>
          <ul className="mt-10 pr-10 text-left">
            <li className="mb-3">
              <Image
                width={32}
                height={32}
                style={{ width: "auto" }}
                src="/yellow-star.webp"
                className="w-8 float-left mr-4 mt-2"
                alt="Yellow Star Icon"
              />
              <strong>Strengthens memory pathways:</strong> Active recall forces
              your brain to retrieve information, reinforcing neural connections
              and improving long-term retention.
            </li>
            <li className="mb-3">
              <Image
                width={32}
                height={32}
                style={{ width: "auto" }}
                src="/yellow-star.webp"
                className="w-8 float-left mr-4 mt-2"
                alt="Yellow Star Icon"
              />
              <strong>Identifies knowledge gaps:</strong> By testing yourself,
              you quickly discover what you don&apos;t know, allowing for
              targeted review and more efficient study sessions.
            </li>
            <li className="mb-3">
              <Image
                width={32}
                height={32}
                style={{ width: "auto" }}
                src="/yellow-star.webp"
                className="w-8 float-left mr-4 mt-2"
                alt="Yellow Star Icon"
              />
              <strong>Enhances understanding:</strong> Recalling information
              requires you to explain concepts in your own words, deepening your
              comprehension of the material.
            </li>
            <li className="mb-3">
              <Image
                width={32}
                height={32}
                style={{ width: "auto" }}
                src="/yellow-star.webp"
                className="w-8 float-left mr-4 mt-2"
                alt="Yellow Star Icon"
              />
              <strong>Improves focus:</strong> Active recall demands full
              attention, reducing mind-wandering and increasing the
              effectiveness of your study time.
            </li>
            <li className="mb-3">
              <Image
                width={32}
                height={32}
                style={{ width: "auto" }}
                src="/yellow-star.webp"
                className="w-8 float-left mr-4 mt-2"
                alt="Yellow Star Icon"
              />
              <strong>Mimics real-world application:</strong> Practicing active
              recall simulates how you&apos;ll need to use the information in
              exams or real-life situations, better preparing you for future
              challenges.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
