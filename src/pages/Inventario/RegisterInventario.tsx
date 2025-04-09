/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoEye } from "react-icons/io5";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useReservation } from "../../hooks/useReservation";

export default function AdminHome() {
  const {
    recientes,
    completas,
    rechazadas,
    showCompletas,
    showRechazadas,
    getStatusClass,
    setShowCompletas,
    setShowRechazadas,
  } = useReservation();

  return (
    <>
      <PageBreadcrumb pageTitle="ADMINISTRADOR - PÁGINA INICIAL" />
      <div className="space-y-6 text-sm">
        <ComponentCard title="🕒 Peticiones Recientes">
          {recientes.length > 0 ? (
            <ul className="list-none space-y-2">
              {recientes.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between">
                  <a href={`/sq/details/${r.id}`} className="hover:underline">
                    <li className="text-gray-800 dark:text-white/80">
                      <span className="font-medium">{r.reason}</span>
                    </li>
                  </a>
                  <span className={getStatusClass(r.status)}>{r.status}</span>
                </div>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">
              No hay peticiones recientes.
            </p>
          )}
        </ComponentCard>

        <ComponentCard title="✅ Reservaciones Completadas">
          <button
            className="text-[#39A900] text-sm font-medium hover:underline"
            onClick={() => setShowCompletas(!showCompletas)}
          >
            {showCompletas ? "Ocultar" : "Mostrar"}
          </button>
          {showCompletas &&
            (completas.length > 0 ? (
              <ul className="list-none pl-0 space-y-2">
                {completas.map((r: any) => (
                  <li
                    key={r.id}
                    className="flex justify-between items-center text-gray-800 dark:text-white/80 border-b border-gray-100 dark:border-gray-700 py-1"
                  >
                    <span className="font-medium">{r.reason}</span>
                    <div className="flex gap-2">
                      <a
                        href={`/edit-inventario/${r.id}`}
                        className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600"
                      >
                        <IoEye size={20} />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-xs">
                No hay reservaciones completadas.
              </p>
            ))}
        </ComponentCard>

        <ComponentCard title="❌ Reservaciones Rechazadas">
          <button
            className="text-[#39A900] font-medium text-sm hover:underline"
            onClick={() => setShowRechazadas(!showRechazadas)}
          >
            {showRechazadas ? "Ocultar" : "Mostrar"}
          </button>
          {showRechazadas &&
            (rechazadas.length > 0 ? (
              <ul className="list-none pl-0 space-y-2">
                {rechazadas.map((r: any) => (
                  <li
                    key={r.id}
                    className="flex justify-between items-center text-gray-800 dark:text-white/80 border-b border-gray-100 dark:border-gray-700 py-1"
                  >
                    <span className="font-medium">{r.reason}</span>
                    <div className="flex gap-2">
                      <a
                        href={`/edit-inventario/${r.id}`}
                        className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600"
                      >
                        <IoEye size={20} />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-xs">
                No hay reservaciones rechazadas.
              </p>
            ))}
        </ComponentCard>
      </div>
    </>
  );
}
