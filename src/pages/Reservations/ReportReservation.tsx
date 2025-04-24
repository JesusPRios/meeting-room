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
        const res = await axios.get("http://10.4.39.178:3002/get-reservation");
        setReservation(res.data);
      } catch (error) {
        console.error("Error fetching reservations", error);
      }
    };
    fetchReservations();
  }, []);

  const next7Days = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date.toLocaleDateString());
    }
    return days;
  }, []);

  const estados = ["Pendiente", "Confirmada", "Finalizada", "Rechazada"];

  const dailyStats = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};
    next7Days.forEach((date) => {
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
  }, [reservation, next7Days]);

  const dailyData = {
    labels: next7Days,
    datasets: estados.map((estado, idx) => ({
      label: estado,
      backgroundColor: ["#fbbf24", "#34d399", "#60a5fa", "#f87171"][idx],
      data: next7Days.map((date) => dailyStats[date][estado]),
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
            return `${label}: ${value} \nResponsable: ${uniqueUsers.join(
              ", "
            )}`;
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

    // Cuenta cuántas veces aparece cada usuario
    reservation.forEach((r: any) => {
      const user = r.nombre_usuario || "Desconocido";
      const userCapitalized = capitalizeWords(user); // Si tienes una función que capitaliza nombres
      counts[userCapitalized] = (counts[userCapitalized] || 0) + 1;
    });

    // Convierte el objeto en array y ordena de mayor a menor cantidad de reservas
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Orden descendente por número de reservas
      .slice(0, 5); // Toma solo los 5 primeros
  }, [reservation]);

  return (
    <ComponentCard title="Reportes de Reservas" className="w-full">
      <div className="p-3 space-y-12">
        <div>
          <h2 className="text-xl font-semibold mb-4">Raiting de usuarios</h2>
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
                  {count} reserva(s) {index === 0}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="">
          <h2 className="text-md font-semibold mb-4">
            📅 Peticiones mensuales por estado
          </h2>
          <Bar data={dailyData} options={chartOptions} />
        </div>
      </div>
    </ComponentCard>
  );
}
