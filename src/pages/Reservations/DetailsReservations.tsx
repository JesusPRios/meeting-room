/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
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
import GIF from "../../../public/g0R5-unscreen.gif";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const ReservationDetails = () => {
  const { id } = useParams();
  const {
    reser,
    getReservationById,
    AcceptReservation,
    RejectReservation,
    setError,
    navigate,
    error,
    formatTimeTo12Hour,
    loading,
    setLoading,
    setSuccessMessage,
    successMessage,
    capitalizeFirstLetter,
  } = useReservation();

  useEffect(() => {
    if (id) getReservationById(Number(id));
  }, [id]);

  if (!reser) return <p className="text-gray-500">Cargando...</p>;

  const handleReject = async (id: number, cedula: string) => {
    try {
      setLoading(true);
      await RejectReservation(id, cedula);
      setSuccessMessage("La reserva fue rechazada correctamente.");
      setError(null);
      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/admin/home");
      }, 3000);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleAccept = async (id: number, cedula: string) => {
    try {
      setLoading(true);
      await AcceptReservation(id, cedula);
      setSuccessMessage("La reserva fue confirmada correctamente.");
      setError(null);
      setTimeout(() => {
        setSuccessMessage(null);
        navigate("/admin/home");
      }, 3000);
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      setTimeout(() => setError(null), 5000);
    }
  };

  const participants = reser.participants
    ?.split(/,|\sy\s/)
    .map((p) => capitalizeFirstLetter(p.trim()));
  const formattedTimeStart = formatTimeTo12Hour(reser.timeStart);
  const formattedTimeEnd = formatTimeTo12Hour(reser.timeEnd);

  return (
    <>
      <PageBreadcrumb pageTitle="Detalles de la Reservación" />

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
            <Info icon={IoDocumentText} label="Motivo" value={reser.reason} />
          </div>

          <Info
            icon={IoCalendar}
            label="Fecha"
            value={new Date(reser.date).toLocaleDateString()}
          />
          <Info
            icon={IoTime}
            label="Hora"
            value={`${formattedTimeStart} - ${formattedTimeEnd}`}
          />
          <Info icon={IoHourglass} label="Duración" value={reser.duration} />
          <Info
            icon={IoPerson}
            label="Solicitante"
            value={reser.nombre_usuario}
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
            onClick={() => handleReject(reser.id, reser.cedula_user)}
          >
            Rechazar
          </button>
          <button
            className="bg-[#39A900] hover:bg-[#39A900] p-3 rounded-lg text-white text-sm"
            onClick={() => handleAccept(reser.id, reser.cedula_user)}
          >
            Confirmar
          </button>
        </div>
        {loading && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#39A900] bg-opacity-70">
            <img src={GIF} alt="Cargando..." className="w-24 h-24" />
          </div>
        )}
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
