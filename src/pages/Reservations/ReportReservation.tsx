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
import { Bar, Pie } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ComponentCard from "../../components/common/ComponentCard";

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

  // 📆 Gráfico 1: Peticiones mensuales por estado
  const monthlyStats = useMemo(() => {
    const result: Record<string, Record<string, number>> = {};
    reservation.forEach((r: any) => {
      const date = new Date(r.date);
      const month = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      if (!result[month]) result[month] = {};
      result[month][r.status] = (result[month][r.status] || 0) + 1;
    });
    return result;
  }, [reservation]);

  const monthlyLabels = Object.keys(monthlyStats);
  const estados = ["Pendiente", "Confirmada", "Finalizada", "Rechazada"];

  const monthlyData = {
    labels: monthlyLabels,
    datasets: estados.map((estado, idx) => ({
      label: estado,
      backgroundColor: ["#fbbf24", "#34d399", "#60a5fa", "#f87171"][idx],
      data: monthlyLabels.map((month) => monthlyStats[month][estado] || 0),
    })),
  };

  // 👤 Gráfico 2: Usuarios con más reservas
  const topUsers = useMemo(() => {
    const counts: Record<string, number> = {};
    reservation.forEach((r: any) => {
      const user = r.nombre_usuario || "Desconocido";
      counts[user] = (counts[user] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [reservation]);

  const userData = {
    labels: topUsers.map(([user]) => user),
    datasets: [
      {
        label: "Reservas",
        data: topUsers.map(([, count]) => count),
        backgroundColor: [
          "#a5b4fc",
          "#f9a8d4",
          "#6ee7b7",
          "#fcd34d",
          "#f87171",
        ],
      },
    ],
  };

  // ⭐ Gráfico 3: Opiniones de la App (si hay campo `rating`)
  const ratingStats = [1, 2, 3, 4, 5].map(
    (r) => reservation.filter((res) => res.rating === r).length
  );

  const ratingData = {
    labels: ["1 ⭐", "2 ⭐", "3 ⭐", "4 ⭐", "5 ⭐"],
    datasets: [
      {
        label: "Votos",
        data: ratingStats,
        backgroundColor: [
          "#f87171",
          "#fbbf24",
          "#facc15",
          "#4ade80",
          "#22d3ee",
        ],
      },
    ],
  };

  return (
    <ComponentCard title="Reportes de Reservas" className="w-full">
      <div className="p-6 space-y-12">
        <h1 className="text-2xl font-bold">📊 Reporte de Reservas</h1>

        {/* Gráfico 1 y 2 juntos en una fila */}
        <div className="flex flex-wrap gap-6">
          {/* Gráfico 1: Peticiones mensuales */}
          <div className="flex-1 min-w-[300px] max-w-[600px]">
            <h2 className="text-md font-semibold mb-4">
              📅 Peticiones mensuales por estado
            </h2>
            <Bar data={monthlyData} />
          </div>

          {/* Gráfico 2: Usuarios con más reservas */}
          <div className="flex-1 min-w-[300px] max-w-[400px]">
            <h2 className="text-xl font-semibold mb-4">
              👥 Usuarios con más reservas
            </h2>
            <Pie data={userData} />
          </div>
        </div>

        {/* Gráfico 3: Opiniones sobre la App */}
        <div>
          <h2 className="text-xl font-semibold mb-4">⭐ Opiniones de la app</h2>
          <Bar data={ratingData} />
        </div>
      </div>
    </ComponentCard>
  );
}