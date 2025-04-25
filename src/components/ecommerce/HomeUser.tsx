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
import { IoTimeOutline } from "react-icons/io5";

export default function HomeUser() {
  const {
    selectedDate,
    setSelectedDate,
    getReservationByDate,
    information,
    formattedDate,
    formatTime,
    capitalizeWords,
    setCurrentPage,
    currentPage,
    itemsPerPage,
  } = useReservation();
  const role = Cookies.get("role");

  useEffect(() => {
    if (selectedDate) {
      getReservationByDate(selectedDate);
      setCurrentPage(1);
    }
  }, [selectedDate]);

  if (role === "admin") {
    return (
      <div>
        Querido administrador, esta vista es solo para usuarios generales.
        Diríjase a{" "}
        <a href="/admin/home" className="text-[#39A900] hover:underline">
          la página principal.
        </a>
      </div>
    );
  }

  const totalPages = Math.ceil(information?.length / itemsPerPage) || 1;

  const paginatedData = information?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
           title={`Información de las reservaciones${formattedDate ? ` para el ${formattedDate}` : ""}`}
          >
            {selectedDate ? (
              <div>
                {information && information.length > 0 ? (
                  <>
                    <Table className="border-separate border-spacing-y-2 mt-[-20px]">
                      <TableHeader>
                        <TableRow>
                          <TableCell
                            isHeader
                            className="px-2 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                          >
                            Usuario
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-6 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                          >
                            Hora inicio
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-6 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                          >
                            Hora fin
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                          >
                            Estado
                          </TableCell>
                          {/* <TableCell isHeader className="px-5 py-3" /> */}
                        </TableRow>
                      </TableHeader>

                      <TableBody className="text-sm">
                        {paginatedData.map((item) => (
                          <TableRow
                          key={item.id}
                          className="bg-white dark:bg-gray-800 shadow-sm rounded-md"
                        >
                        
                            <TableCell className="px-2 text-start text-gray-900 dark:text-white/90">
                              {capitalizeWords(item.nombre_usuario)}
                            </TableCell>
                            <TableCell className="px-6 text-start text-gray-900 dark:text-white/90">
                              {formatTime(item.timeStart)}
                            </TableCell>
                            <TableCell className="px-6 text-start text-gray-900 dark:text-white/90">
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
                                  className="inline-flex items-center justify-center bg-[#39A900] hover:bg-[#2f8a00] text-white rounded-full w-8 h-8 transition duration-200 ml-2"
                                  title="Reagendar"
                                >
                                  <IoTimeOutline className="text-2xl" />
                                </a>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-6 flex justify-center space-x-2 text-sm">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(prev - 1, 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        Anterior
                      </button>
                      <span className="px-2 py-1 text-sm">
                        Página {currentPage} de {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(prev + 1, totalPages)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                      >
                        Siguiente
                      </button>
                    </div>
                  </>
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
