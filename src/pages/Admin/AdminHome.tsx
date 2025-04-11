/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useReservation } from "../../hooks/useReservation";

export default function AdminHome() {
  const {
    recientes,
    getStatusClass,
  } = useReservation();

  return (
    <>
      <PageBreadcrumb pageTitle="Listado de reservas pendientes" />
      <div className="space-y-6 text-sm">
        <ComponentCard title="🕒 Peticiones Recientes">
          {recientes.length > 0 ? (
            <ul className="list-none space-y-2">
              {recientes.map((r: any) => (
                <div key={r.id} className="flex items-center justify-between">
                  <a href={`/details-reservations/${r.id}`} className="hover:underline">
                    <li className="text-gray-800 dark:text-white/80">
                      <span className="font-medium">{r.reason}</span>
                    </li>
                  </a>
                  <span className={getStatusClass(r.status)}>{r.status}</span>
                </div>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 text-[15px]">Ningún usuario ha realizado una reserva.</p>
          )}
        </ComponentCard>

    
      </div>
    </>
  );
}
