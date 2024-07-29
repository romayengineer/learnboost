"use client";
import SideBar from "@/components/sidebar";
import { Bar } from "react-chartjs-2";

import {
  Chart as Chartjs,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

Chartjs.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ReportsPage() {
  // TODO delete is just for testing the UI
  const dataset = Array.from({ length: 7 }, () => Math.random() * 150).map(
    (e) => e + 100
  );
  const chartData = {
    labels: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturdays",
    ],
    datasets: [
      {
        label: "Time Studied",
        data: dataset,
      },
    ],
  };
  const chartOptions = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Time",
      },
    },
    maintainAspectRatio: true,
    responsive: true,
  };
  return (
    <main>
      <SideBar />
      <div className="p-6">
        <h1 className="text-2xl">Reports</h1>
        <br />
        <div className="p-10 flex flex-row justify-center items-center">
          <Bar data={chartData} />
        </div>
      </div>
    </main>
  );
}
