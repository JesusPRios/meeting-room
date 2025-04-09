import { useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useReservation } from "../../hooks/useReservation";
import ComponentCard from "../common/ComponentCard";
import PageBreadcrumb from "../common/PageBreadCrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Cookies from "js-cookie";

export default function MetricsCharts() {
  const role = Cookies.get("role");
  const {
    selectedDate,
    setSelectedDate,
    getReservationByDate,
    information,
    formattedDate,
    formatTime,
  } = useReservation();

  useEffect(() => {
    if (selectedDate) {
      getReservationByDate(selectedDate);
    }
  }, [getReservationByDate, selectedDate]);

  if (role === "admin") {
    return (
      <div>
        Querido administrador, esta vista es solo para usuarios generales.
        dirijase a <a href="/inventario-register" className="text-[#39A900] hover:underline">la página principal.</a>
      </div>
    );
  }

  return (
    <>
      <PageBreadcrumb pageTitle="Consulta General - Reservaciones" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="scale-90 origin-top-left">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>
        </div>

        <div className="col-span-2">
          <ComponentCard
            title={`Información de las reservaciones para el ${
              formattedDate ? formattedDate : ""
            }`}
          >
            {selectedDate ? (
              <div>
                {information ? (
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                        >
                          Usuario
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                        >
                          Hora inicio
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                        >
                          Hora fin
                        </TableCell>
                        <TableCell
                          isHeader
                          className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                        >
                          Estado
                        </TableCell>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-sm">
                      <TableRow>
                        <TableCell className="sm:px-6 text-start text-gray-900 dark:text-white/90">
                          {information.nombre_usuario}
                        </TableCell>
                        <TableCell className="sm:px-6 text-start text-gray-900 dark:text-white/90">
                          {formatTime(information.timeStart)}
                        </TableCell>
                        <TableCell className="sm:px-6 text-start text-gray-900 dark:text-white/90">
                          {formatTime(information.timeEnd)}
                        </TableCell>
                        <TableCell
                          className={`px-4 py-1.5 text-sm font-semibold text-center rounded-full
    ${
      information.status === "Pendiente"
        ? "bg-red-100 text-red-700 "
        : information.status === "Confirmada"
        ? "bg-green-100 text-green-700  "
        : information.status === "Cancelada"
        ? "bg-yellow-100 text-yellow-700  "
        : "bg-gray-200 text-gray-700  "
    }`}
                        >
                          {information.status}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-sm text-gray-500">
                    No hay reservas para esta fecha.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Selecciona una fecha para ver información.
              </p>
            )}
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
