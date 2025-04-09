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
      <PageBreadcrumb pageTitle="ADMINISTRADOR - PÁGINA INICIAL" />
      <div className="space-y-6 text-sm">
        {/* Peticiones recientes (Pendientes) */}
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
            <p className="text-gray-500 text-sm">No hay peticiones recientes.</p>
          )}
        </ComponentCard>

    
      </div>
    </>
  );
}
