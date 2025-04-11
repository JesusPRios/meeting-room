/* eslint-disable react-hooks/exhaustive-deps */
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
} from "../ui/table";
import Cookies from "js-cookie";
import { es } from "date-fns/locale";

export default function HomeUser() {
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
  }, [selectedDate]);

  if (role === "admin") {
    return (
      <div>
        Querido administrador, esta vista es solo para usuarios generales.
        dirijase a{" "}
        <a
          href="/inventario-register"
          className="text-[#39A900] hover:underline"
        >
          la página principal.
        </a>
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
              locale={es}
            />
          </div>
        </div>

        <div className="col-span-2">
          <ComponentCard
            title={`Información de las reservaciones ${
              formattedDate ? formattedDate : ""
            }`}
          >
            {selectedDate ? (
              <div>
                {information && information.length > 0 ? (
                 <Table className="border-separate border-spacing-y-2 mt-[-10px]">
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
                        {/* <TableCell
                          isHeader
                          className="px-5 py-3 font-semibold text-gray-500 text-center text-theme-sm dark:text-white"
                        >
                        </TableCell> */}
                      </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-sm">
                      {information.map((item) => (
                        <TableRow key={item.id} className="border-b-2 border-gray-200">
                          <TableCell className="sm:px-6 text-start text-gray-900 dark:text-white/90">
                            {item.nombre_usuario}
                          </TableCell>
                          <TableCell className="sm:px-6 text-start text-gray-900 dark:text-white/90">
                            {formatTime(item.timeStart)}
                          </TableCell>
                          <TableCell className="sm:px-6 text-start text-gray-900 dark:text-white/90">
                            {formatTime(item.timeEnd)}
                          </TableCell>
                          <TableCell
                            className={`px-4 py-1.5 text-sm font-semibold text-center rounded-full
        ${
          item.status === "Pendiente"
            ? "bg-red-100 text-red-700"
            : item.status === "Confirmada"
            ? "bg-green-100 text-green-700"
            : item.status === "Cancelada"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-200 text-gray-700"
        }`}
                          >
                            {item.status}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.repetitive && (
                              <a
                                href={`/repetitive-reservations/${item.id}`}
                                className="bg-[#39A900] text-white px-3 py-2 rounded-full text-xs transition"
                              >
                                R
                              </a>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-[15px] text-gray-700">
                    No hay reservas registradas para esta fecha.
                  </p>
                )}
              </div>
            ) : (

              <p className="text-[15px] text-gray-700">
                Selecciona una fecha para ver las reservaciones
                correspondientes.
              </p>
            )}
          </ComponentCard>
        </div>
      </div>
    </>
  );
}
