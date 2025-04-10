/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reservation } from "./../types/Reservation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useReservation = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reservation, setReservation] = useState<Reservation[]>([]);
  const [information, setInformation] = useState<Reservation | null>({
    id: 0,
    user_id: 0,
    timeStart: "",
    timeEnd: "",
    status: "",
    reason: "",
    date: new Date(),
    duration: "",
    participants: "",
    cedula_user: "",
    nombre_usuario: "",
  });
  const [reser, setReser] = useState({
    id: 0,
    user_id: 0,
    timeStart: "",
    timeEnd: "",
    status: "",
    reason: "",
    date: new Date(),
    duration: "",
    participants: "",
    cedula_user: "",
  });
  const [reservedRange, setReservedRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [completas, setCompletas] = useState([]);
  const [rechazadas, setRechazadas] = useState([]);
  const [recientes, setRecientes] = useState([]);
  const navigate = useNavigate();
  const [showCompletas, setShowCompletas] = useState(false);
  const [showRechazadas, setShowRechazadas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [cedulaInput, setCedulaInput] = useState("");
  const [sugerencias, setSugerencias] = useState<any[]>([]);

  useEffect(() => {
    const getReservation = async () => {
      try {
        const [response] = await Promise.all([
          axios.get("http://10.4.32.29:3002/get-reservation"),
        ]);

        const now = new Date();
        const updatedReservations = await Promise.all(
          response.data.map(async (res: Reservation) => {
            const reservationEnd = new Date(`${res.date}T${res.timeEnd}`);

            if (reservationEnd < now && res.status !== "Finalizada") {
              await axios.put(
                `http://10.4.32.29:3002/update-reservation/${res.id}`,
                {
                  status: "Finalizada",
                }
              );

              return { ...res, status: "Finalizada" };
            }

            return res;
          })
        );

        setReservation(updatedReservations);
      } catch (error) {
        console.log(error);
      }
    };

    getReservation();
  }, []);

  useEffect(() => {
    const fetchReservaciones = async () => {
      try {
        const res = await axios.get("http://10.4.32.29:3002/get-reservation");
        const data = res.data;
        const ahora = new Date();

        const pendientes = data.filter((r: any) => {
          const fechaHoraReserva = new Date(r.date);
          const [hora, minuto, segundo] = r.timeStart.split(":").map(Number);
          fechaHoraReserva.setHours(hora, minuto, segundo || 0);

          return fechaHoraReserva >= ahora && r.status === "Pendiente";
        });

        const confirmadas = data.filter((r: any) => r.status === "Confirmada");
        const rechazadas = data.filter((r: any) => r.status === "Rechazada");

        pendientes.forEach((reserva: any) => {
          const fechaInicio = new Date(reserva.date);
          const [hora, minuto, segundo] = reserva.timeStart
            .split(":")
            .map(Number);
          fechaInicio.setHours(hora, minuto, segundo || 0);

          const ahora = new Date();
          const diferenciaEnMilisegundos =
            fechaInicio.getTime() - ahora.getTime();
          const diferenciaEnSegundos = diferenciaEnMilisegundos / 1000;

          const margen = 30; 
          const unaHoraEnSegundos = 3600;

          if (
            diferenciaEnSegundos >= unaHoraEnSegundos - margen &&
            diferenciaEnSegundos <= unaHoraEnSegundos + margen
          ) {
            NotifyAdminReservationPending(reserva.id);
          }
        });

        setCompletas(confirmadas);
        setRechazadas(rechazadas);
        setRecientes(pendientes);
      } catch (error) {
        console.error("Error al cargar reservaciones:", error);
      }
    };

    fetchReservaciones();
  }, []);

  useEffect(() => {
    if (reser.timeStart && reser.timeEnd) {
      const [startHour, startMin] = reser.timeStart.split(":").map(Number);
      const [endHour, endMin] = reser.timeEnd.split(":").map(Number);
      const start = new Date(0, 0, 0, startHour, startMin);
      const end = new Date(0, 0, 0, endHour, endMin);
      let diff = (end.getTime() - start.getTime()) / (1000 * 60);
      if (diff < 0) diff += 24 * 60;
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;
      const durationStr = `${hours}h ${minutes}min`;
      setReser((prev) => ({ ...prev, duration: durationStr }));
    }
  }, [reser.timeStart, reser.timeEnd]);

  const calcularDuracion = (start: string, end: string) => {
    const [hStart, mStart] = start.split(":").map(Number);
    const [hEnd, mEnd] = end.split(":").map(Number);

    const startMinutes = hStart * 60 + mStart;
    const endMinutes = hEnd * 60 + mEnd;

    const diff = endMinutes - startMinutes;

    if (diff <= 0) return "0h 0m";

    const horas = Math.floor(diff / 60);
    const minutos = diff % 60;

    return `${horas}h ${minutos}m`;
  };

  const getStatusClass = (status: string) => {
    return `px-4 py-1.5 text-sm font-semibold text-center rounded-full
      ${
        status === "Pendiente"
          ? "bg-red-100 text-red-700"
          : status === "Confirmada"
          ? "bg-green-100 text-green-700"
          : status === "Cancelada"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-200 text-gray-700"
      }`;
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedEstado(e.target.value);
  };
  const getFilteredReservaciones = () => {
    if (selectedEstado === "confirmadas") return completas;
    if (selectedEstado === "rechazada") return rechazadas;
    return [];
  };
  const filteredReservas = getFilteredReservaciones();

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReser((prevInformation) => ({
      ...(prevInformation || {}),
      reason: e.target.value,
    }));
  };

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);

    setReser((prevInformation) => ({
      ...(prevInformation || {}),
      date: selectedDate,
    }));

    await getReservationByDate(selectedDate);
  };

  const handleTimeStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setReser((prevInformation) => {
      const updated = {
        ...(prevInformation || {}),
        timeStart: value,
      };

      if (updated.timeEnd) {
        updated.duration = calcularDuracion(value, updated.timeEnd);
      }

      return updated;
    });

    e.target.blur(); 
  };

  const handleTimeEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setReser((prevInformation) => {
      const updated = {
        ...(prevInformation || {}),
        timeEnd: value,
      };

      if (updated.timeStart) {
        updated.duration = calcularDuracion(updated.timeStart, value);
      }

      return updated;
    });

    e.target.blur(); 
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReser((prevInformation) => ({
      ...(prevInformation || {}),
      duration: e.target.value,
    }));
  };

  const handleParticipantsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReser((prevInformation) => ({
      ...(prevInformation || {}),
      participants: e.target.value,
    }));
  };

  const handleCedulaUserChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCedulaInput(value);
    reser.cedula_user = value;

    if (value.length >= 3) {
      try {
        const res = await axios.get(
          `http://10.4.32.29:3002/search-users?cedula=${value}`
        );
        setSugerencias(res.data);
      } catch (err) {
        console.error("Error buscando usuarios:", err);
      }
    } else {
      setSugerencias([]);
    }
  };

  const formattedDate = selectedDate?.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  const getReservationByDate = async (date: Date) => {
    const formattedDate = date.toISOString().slice(0, 10);
    try {
      const response = await axios.get(
        `http://10.4.32.29:3002/get-reservation-by-date/${formattedDate}`
      );
      const data = response.data;

      if (data.error) {
        setInformation(null);
      } else {
        setInformation(data[0]);

        setReservedRange({
          start: data[0].timeStart,
          end: data[0].timeEnd,
        });
      }
    } catch (error) {
      console.log(error);
      setInformation(null);
    }
  };

  const getReservationById = async (id: number) => {
    try {
      const response = await axios.get(
        `http://10.4.32.29:3002/get-reservation-by-id/${id}`
      );
      const data = response.data;

      if (data.error) {
        setInformation(null);
      } else {
        setInformation(data[0]);
      }
    } catch (error) {
      console.log(error);
      setInformation(null);
    }
  };

  const registerReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    const duracionCalculada = calcularDuracion(reser.timeStart, reser.timeEnd);

    if (duracionCalculada === "0h 0m") {
      alert(
        "La duración no puede ser 0h 0m. Por favor, revisa las horas ingresadas."
      );
      return;
    }

    const data = {
      timeStart: reser.timeStart,
      timeEnd: reser.timeEnd,
      reason: reser.reason,
      date: reser.date.toISOString().split("T")[0],
      duration: duracionCalculada, 
      participants: reser.participants,
      cedula_user: reser.cedula_user,
      status: "Pendiente",
    };

    try {
      const response = await axios.post(
        "http://10.4.32.29:3002/register-reservation",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        navigate("/admin/home");
      }
    } catch (error) {
      console.error("Error al registrar la reserva", error);
    }
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(":");
    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const AcceptReservation = async (id: number, cedula: string) => {
    try {
      const response = await axios.post(
        `http://10.4.32.29:3002/accept-reservation/${id}-${cedula}`
      );
      const { success } = response.data;
      return success;
    } catch (error) {
      console.error("Error al aceptar la reserva:", error);
    }
  };

  const RejectReservation = async (id: number, cedula: string) => {
    try {
      const response = await axios.post(
        `http://10.4.32.29:3002/reject-reservation/${id}-${cedula}`
      );

      const { success } = response.data;
      return success;
    } catch (error) {
      console.error("Error al rechazar la reserva:", error);
      throw error;
    }
  };

  const NotifyAdminReservationPending = async (id: number) => {
    try {
      const response = await axios.post(
        `http://10.4.32.29:3002/notify-admin-reservation-pending/${id}`
      );
      const { success } = response.data;
      return success;
    } catch (error) {
      console.error(
        "Error al notificar al admin de la reserva pendiente:",
        error
      );
    }
  };

  return {
    reservation,
    getReservationByDate,
    selectedDate,
    setSelectedDate,
    information,
    registerReservation,
    formattedDate,
    handleReasonChange,
    handleDateChange,
    handleTimeStartChange,
    handleTimeEndChange,
    handleDurationChange,
    handleParticipantsChange,
    handleCedulaUserChange,
    reser,
    formatTime,
    reservedRange,
    setReservedRange,
    recientes,
    completas,
    rechazadas,
    getReservationById,
    AcceptReservation,
    showCompletas,
    showRechazadas,
    getStatusClass,
    setShowCompletas,
    setShowRechazadas,
    RejectReservation,
    error,
    setError,
    navigate,
    handleEstadoChange,
    filteredReservas,
    selectedEstado,
    NotifyAdminReservationPending,
    cedulaInput,
    setCedulaInput,
    sugerencias,
    setSugerencias,
  };
};
