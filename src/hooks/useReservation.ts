/* eslint-disable @typescript-eslint/no-explicit-any */
import { Reservation } from "./../types/Reservation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useReservation = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reservation, setReservation] = useState<Reservation[]>([]);
  const [information, setInformation] = useState<Reservation[]>([]);
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
    repetitive: "",
    nombre_usuario: ""
  });
  const [reservedRange, setReservedRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [completas, setCompletas] = useState([]);
  const [rechazadas, setRechazadas] = useState([]);
  const [recientes, setRecientes] = useState([]);
  const [showCompletas, setShowCompletas] = useState(false);
  const [showRechazadas, setShowRechazadas] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string>("");
  const [cedulaInput, setCedulaInput] = useState("");
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const gestionarReservaciones = async () => {
      try {
        const res = await axios.get("http://localhost:3002/get-reservation");
        const data = res.data;
        const ahora = new Date();

        // 1. Actualizamos estados a "Finalizada" si ya pasó la hora
        const actualizadas = await Promise.all(
          data.map(async (reserva: any) => {
            const finReserva = new Date(`${reserva.date}T${reserva.timeEnd}`);
            if (finReserva < ahora && reserva.status !== "Finalizada") {
              await axios.put(
                `http://localhost:3002/update-reservation/${reserva.id}`,
                { status: "Finalizada" }
              );
              return { ...reserva, status: "Finalizada" };
            }
            return reserva;
          })
        );

        // 2. Clasificamos las reservas por estado
        const pendientes = data.filter((r: any) => {
          const fechaHora = new Date(r.date);
          const [h, m, s] = r.timeStart.split(":").map(Number);
          fechaHora.setHours(h, m, s || 0);
          return fechaHora >= ahora && r.status === "Pendiente";
        });

        const confirmadas = data.filter((r: any) => r.status === "Confirmada");
        const rechazadas = data.filter((r: any) => r.status === "Rechazada");

        // 3. Notificamos si hay alguna reunión pendiente dentro de 1h ± margen
        pendientes.forEach((reserva: any) => {
          const fechaInicio = new Date(reserva.date);
          const [h, m, s] = reserva.timeStart.split(":").map(Number);
          fechaInicio.setHours(h, m, s || 0);

          const diferenciaSegundos =
            (fechaInicio.getTime() - ahora.getTime()) / 1000;
          const margen = 30; // segundos
          const unaHora = 3600; // segundos

          if (
            diferenciaSegundos >= unaHora - margen &&
            diferenciaSegundos <= unaHora + margen
          ) {
            NotifyAdminReservationPending(reserva.id);
          }
        });

        setReservation(actualizadas); // Todas
        setRecientes(pendientes);
        setCompletas(confirmadas);
        setRechazadas(rechazadas);
      } catch (error) {
        console.error("Error al gestionar reservaciones:", error);
      }
    };

    gestionarReservaciones();
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
    if (selectedEstado === "Confirmada") return completas;
    if (selectedEstado === "Rechazada") return rechazadas;
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

      e.target.blur();
      return updated;
    });
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

      e.target.blur();
      return updated;
    });
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
          `http://localhost:3002/search-users?cedula=${value}`
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
        `http://localhost:3002/get-reservation-by-date/${formattedDate}`
      );
      const data = response.data;

      if (data.error) {
        setInformation([]);
      } else {
        setInformation(data);

        // setReservedRange({
        //   start: data[0].timeStart,
        //   end: data[0].timeEnd,
        // });
      }
    } catch (error) {
      console.log(error);
      setInformation([]);
    }
  };

  const getReservationById = async (id: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3002/get-reservation-by-id/${id}`
      );
      const data = response.data;

      if (data.error) {
        setInformation([]);
      } else {
        setReser(data[0]);
        setInformation(data[0]);
      }
    } catch (error) {
      console.log(error);
      setInformation([]);
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

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const repetitive = formData.get("repetitive");

    const data = {
      timeStart: reser.timeStart,
      timeEnd: reser.timeEnd,
      reason: reser.reason,
      date: reser.date.toISOString().split("T")[0],
      duration: duracionCalculada,
      participants: reser.participants,
      cedula_user: reser.cedula_user,
      status: "Pendiente",
      repetitive: repetitive,
    };

    try {
      const response = await axios.post(
        "http://localhost:3002/register-reservation",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("La reserva se ha registrado correctamente.");
        navigate("/admin/home");
      }
    } catch (error) {
      console.error("Error al registrar la reserva", error);
    }
  };

  const updateDateReservation = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const duracionCalculada = calcularDuracion(reser.timeStart, reser.timeEnd);
    const formattedDate = reser.date ? new Date(reser.date).toISOString().split("T")[0] : null;
    const repetitive = formData.get("repetitive");

    const data = {
      timeStart: reser.timeStart,
      timeEnd: reser.timeEnd,
      reason: reser.reason,
      date: formattedDate,
      duration: duracionCalculada,
      participants: reser.participants,
      cedula_user: reser.cedula_user,
      status: "Pendiente",
      repetitive: repetitive,
    };

    try {
      const response = await axios.put(
        `http://localhost:3002/reschedule-reservation/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (response.status === 200) {
        alert("La reserva se ha actualizado correctamente.");
        navigate("/home");
      }
    
    } catch (error) {
      console.error("Error al actualizar la reserva", error);
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
        `http://localhost:3002/accept-reservation/${id}-${cedula}`
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
        `http://localhost:3002/reject-reservation/${id}-${cedula}`
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
        `http://localhost:3002/notify-admin-reservation-pending/${id}`
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

  function formatTimeTo12Hour(time24: any) {
    const [hour, minute] = time24.split(":");
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? "PM" : "AM";
    const hour12 = hourNum % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  }

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
    updateDateReservation,
    formatTimeTo12Hour,
    loading,
    setLoading,
    successMessage,
    setSuccessMessage,
  };
};
