/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { IoEye } from "react-icons/io5";
import { useReservation } from "../../hooks/useReservation";

export default function EditSQ() {
  const { filteredReservas, handleEstadoChange, selectedEstado } =
    useReservation();

  return (
    <>
      <PageBreadcrumb pageTitle="Consulta de Reservaciones" />
      <ComponentCard title="📋 Historial de Reservaciones">
        <div className="flex items-center gap-4 mb-4">
          <label className="text-sm font-medium whitespace-nowrap">
            Filtrar por estado:
          </label>
          <select
            className="border border-gray-300 rounded-md p-2 w-64 text-sm dark:bg-gray-800 dark:text-white"
            value={selectedEstado}
            onChange={handleEstadoChange}
          >
            <option value="">Seleccione un estado</option>
            <option value="confirmadas">Confirmadas</option>
            <option value="rechazada">Rechazadas</option>
            <option value="finalizada">Finalizadas</option>
          </select>
        </div>

        {selectedEstado === "" ? (
          <p className="text-gray-500 text-sm">
            Seleccione un estado para ver el historial.
          </p>
        ) : filteredReservas.length > 0 ? (
          <ul className="list-none pl-0 space-y-2">
            {filteredReservas.map((r: any) => (
              <ComponentCard title="Resultado de la busqueda">
                <div className="text-[13px]">
                  {" "}
                  <li
                    key={r.id}
                    className="flex justify-between items-center text-gray-800 dark:text-white/80 border-b border-gray-100 dark:border-gray-700 py-1"
                  >
                    <span className="font-medium">{r.reason}</span>
                    <div className="flex gap-2">
                      <a
                        href={`/get-reservation-by-id/${r.id}`}
                        className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600"
                      >
                        <IoEye size={20} />
                      </a>
                    </div>
                  </li>
                </div>
              </ComponentCard>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">
            No hay reservaciones con estado {selectedEstado}.
          </p>
        )}
      </ComponentCard>
    </>
  );
}
