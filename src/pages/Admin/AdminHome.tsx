/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useReservation } from "../../hooks/useReservation";

export default function AdminHome() {
  const {
    recientes,
    getStatusClass,
    setCurrentPage,
    currentPage,
    itemsPerPage,
  } = useReservation();

  console.log(recientes);

  const totalPages = Math.ceil(recientes?.length / itemsPerPage) || 1;

  const paginatedData = recientes?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <PageBreadcrumb pageTitle="Listado de reservas pendientes" />
      <div className="space-y-6 text-sm">
        <ComponentCard title="🕒 Peticiones Recientes">
          {paginatedData.length > 0 ? (
            <>
              <ul className="list-none space-y-2">
                {paginatedData.map((r: any) => (
                  <div key={r.id} className="flex items-center justify-between">
                    <a
                      href={`/details-reservations/${r.id}`}
                      className="hover:underline"
                    >
                      <li className="text-gray-800 dark:text-white/80">
                        <span className="font-medium">{r.reason}</span>
                      </li>
                    </a>
                    <span className={getStatusClass(r.status)}>{r.status}</span>
                  </div>
                ))}
              </ul>
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
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-700 text-[15px]">
              Ningún usuario ha realizado una reserva.
            </p>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
