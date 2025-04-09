/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IoDocumentText,
  IoCalendar,
  IoPerson,
  IoTime,
  IoHourglass,
  IoCheckmarkCircle,
} from "react-icons/io5";
import ComponentCard from "../../components/common/ComponentCard";
import { useReservation } from "../../hooks/useReservation";
import Alert from "../../components/ui/alert/Alert";

const ReservationDetails = () => {
  const { id } = useParams();
  const {
    information,
    getReservationById,
    AcceptReservation,
    RejectReservation,
    setError,
    navigate,
    error,
  } = useReservation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (id) getReservationById(Number(id));
  }, [id]);

  if (!information) return <p className="text-gray-500">Cargando...</p>;

  const handleReject = async (id: number, cedula: string) => {
    setError(null);
    try {
      await RejectReservation(id, cedula);

      setSuccessMessage("La reserva fue rechazada correctamente.");
      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/inventario-register");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleAccept = async (id: number, cedula: string) => {
    setError(null);
    try {
      await AcceptReservation(id, cedula);

      setSuccessMessage("La reserva fue confirmada correctamente.");
      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/inventario-register");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const participants = information.participants
    ?.split(",")
    .map((p) => p.trim());

  return (
    <>
      <div className="fixed top-24 right-15 z-50">
        {successMessage && (
          <Alert
            variant="info"
            title="Operación exitosa"
            message={successMessage}
            showLink={false}
          />
        )}
        {error && (
          <Alert
            variant="error"
            title="Error"
            message={error}
            showLink={false}
          />
        )}
      </div>
      <ComponentCard title="Detalles de la Reservación">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-6">
          <div className="col-span-1 md:col-span-2">
            <Info
              icon={IoDocumentText}
              label="Motivo"
              value={information.reason}
            />
          </div>

          <Info
            icon={IoCalendar}
            label="Fecha"
            value={new Date(information.date).toLocaleDateString()}
          />
          <Info
            icon={IoTime}
            label="Hora"
            value={`${information.timeStart} - ${information.timeEnd}`}
          />
          <Info
            icon={IoHourglass}
            label="Duración"
            value={information.duration}
          />
          <Info
            icon={IoPerson}
            label="Solicitante"
            value={information.nombre_usuario}
          />

          <div className="col-span-1 md:col-span-2 p-4 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Participantes
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-800 dark:text-white">
              {participants && participants.length > 0 ? (
                participants.map((name, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <IoCheckmarkCircle className="text-blue-500" />
                    {name}
                  </li>
                ))
              ) : (
                <li>No hay participantes registrados.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            className="bg-red-500 hover:bg-red-600 p-3 rounded-lg text-white text-sm"
            onClick={() =>
              handleReject(information.id, information.cedula_user)
            }
          >
            Rechazar
          </button>
          <button
            className="bg-[#39A900] hover:bg-[#39A900] p-3 rounded-lg text-white text-sm"
            onClick={() =>
              handleAccept(information.id, information.cedula_user)
            }
          >
            Confirmar
          </button>
        </div>
      </ComponentCard>
    </>
  );
};

const Info = ({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 shadow-sm">
    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
      <Icon className="text-blue-600 dark:text-blue-400 w-5 h-5" />
    </div>
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm font-medium text-gray-800 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

export default ReservationDetails;
