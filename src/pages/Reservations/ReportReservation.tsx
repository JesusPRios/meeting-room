/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ComponentCard from "../../components/common/ComponentCard";
import { useReservation } from "../../hooks/useReservation";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement
);

export default function ReportReservation() {
  const [reservation, setReservation] = useState<any[]>([]);
  const { capitalizeWords } = useReservation();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await axios.get("http://10.4.33.50:3002/get-reservation");
        setReservation(res.data);
      } catch (error) {
        console.error("Error fetching reservations", error);
      }
    };
    fetchReservations();
  }, []);

  const estados = ["Pendiente", "Confirmada", "Finalizada", "Rechazada"];

  const recentDates = useMemo(() => {
    const uniqueDates = Array.from(
      new Set(
        reservation.map((r) =>
          new Date(r.date).toLocaleDateString()
        )
      )
    );

    return uniqueDates
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .slice(0, 5)
      .reverse();
  }, [reservation]);

  const dailyStats = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};
    recentDates.forEach((date) => {
      result[date] = {};
      estados.forEach((estado) => {
        result[date][estado] = 0;
      });
    });

    reservation.forEach((r: any) => {
      const date = new Date(r.date).toLocaleDateString();
      if (result[date] && result[date][r.status] !== undefined) {
        result[date][r.status] += 1;
      }
    });

    return result;
  }, [reservation, recentDates]);

  const dailyData = {
    labels: recentDates,
    datasets: estados.map((estado, idx) => ({
      label: estado,
      backgroundColor: ["#fbbf24", "#34d399", "#60a5fa", "#f87171"][idx],
      data: recentDates.map((date) => dailyStats[date][estado]),
      maxBarThickness: 30,
    })),
  };

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.x;
            const date = context.label;

            const matchingUsers = reservation
              .filter((r) => {
                return (
                  new Date(r.date).toLocaleDateString() === date &&
                  r.status === label
                );
              })
              .map((r) => capitalizeWords(r.nombre_usuario || "Desconocido"));

            const uniqueUsers = [...new Set(matchingUsers)];
            return `${label}: ${value} \nResponsable: ${uniqueUsers.join(", ")}`;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
          callback: function (tickValue: string | number) {
            return typeof tickValue === "number" && Number.isInteger(tickValue)
              ? tickValue
              : "";
          },
        },
      },
    },
  };

  const topUsers = useMemo(() => {
    const counts: Record<string, number> = {};

    reservation.forEach((r: any) => {
      const user = r.nombre_usuario || "Desconocido";
      const userCapitalized = capitalizeWords(user);
      counts[userCapitalized] = (counts[userCapitalized] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [reservation]);

  return (
    <ComponentCard title="Reportes de Reservas" className="w-full">
      <div className="p-3 space-y-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">⭐ Rating de usuarios</h2>
          <ul className="space-y-3">
            {topUsers.map(([user, count], index) => (
              <li
                key={user}
                className="flex justify-between items-center border-b pb-2"
              >
                <span className="font-medium text-sm">
                  {index === 0 && "⭐ "}
                  {user}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {count} reserva(s)
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-md font-semibold mb-4">
            📅 Reservas recientes por estado
          </h2>
          <Bar data={dailyData} options={chartOptions} />
        </div>
      </div>
    </ComponentCard>
  );
}
