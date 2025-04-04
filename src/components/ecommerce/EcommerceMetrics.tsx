import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Cookies from "js-cookie";
import ComponentCard from "../common/ComponentCard";
import { useCounts } from "../../hooks/useCount";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function MetricsCharts() {
  const { CountUsers, areaCount, sqCount } = useCounts();
  const role = Cookies.get("role");

  const labels = ["Muestras", "Áreas"];
  const dataValues = [sqCount, areaCount];

  if (role === "admin") {
    labels.push("Encargados");
    dataValues.push(CountUsers);
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "Cantidad",
        data: dataValues,
        backgroundColor: [
          "rgba(255, 159, 64, 0.7)",
          "rgba(75, 192, 192, 0.7)",
          "rgba(255, 99, 132, 0.7)",
        ],
        borderColor: [
          "rgb(255, 159, 64)",
          "rgb(75, 192, 192)",
          "rgb(255, 99, 132)",
        ],
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "gray",
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
      },
      y: {
        ticks: {
          color: "gray",
          font: {
            size: 12,
            weight: "bold" as const,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "gray",
          font: {
            size: 11,
            weight: "bold" as const,
          },
        },
      },
    },
  };

  // return (
  //   // <ComponentCard title="Métricas de Gestión" className="w-11/12 mx-auto">
  //   //   <p className="text-sm text-gray-500 dark:text-gray-400">
  //   //     A continuación se muestran las cantidades de sustancias{role === "admin" ? ", encargados de las sustancias" : ""} y áreas registradas en el sistema.
  //   //   </p>
  //   //   <div className="relative h-80 w-full">
  //   //   </div>
  //   // </ComponentCard>

  // );
}