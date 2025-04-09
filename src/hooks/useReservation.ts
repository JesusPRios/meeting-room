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

  useEffect(() => {
    const getReservation = async () => {
      try {
        const [response] = await Promise.all([
          axios.get("http://192.168.200.5:3002/get-reservation"),
        ]);

        const now = new Date();
        const updatedReservations = await Promise.all(
          response.data.map(async (res: Reservation) => {
            const reservationEnd = new Date(`${res.date}T${res.timeEnd}`);

            if (reservationEnd < now && res.status !== "Finalizada") {
              await axios.put(
                `http://192.168.200.5:3002/update-reservation/${res.id}`,
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
        const res = await axios.get("http://192.168.200.5:3002/get-reservation");
        const data = res.data;
        const hoy = new Date();
        const fechaFiltredas = data.filter(
          (r: any) => new Date(r.date) >= hoy && r.status === "Pendiente"
        );
        const completesFiltradas = data.filter(
          (r: any) => r.status === "Confirmada"
        );
        const rechazadasFiltradas = data.filter(
          (r: any) => r.status === "Rechazada"
        );
        setCompletas(completesFiltradas);
        setRechazadas(rechazadasFiltradas);
        setRecientes(fechaFiltredas);
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
    setReser((prevInformation) => ({
      ...(prevInformation || {}),
      timeStart: e.target.value,
    }));
  };

  const handleTimeEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReser((prevInformation) => ({
      ...(prevInformation || {}),
      timeEnd: e.target.value,
    }));
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

  const handleCedulaUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReser((prevInformation) => ({
      ...(prevInformation || {}),
      cedula_user: e.target.value,
    }));
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
        `http://192.168.200.5:3002/get-reservation-by-date/${formattedDate}`
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
        `http://192.168.200.5:3002/get-reservation-by-id/${id}`
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

    const data = {
      timeStart: reser.timeStart,
      timeEnd: reser.timeEnd,
      reason: reser.reason,
      date: reser.date.toISOString().split("T")[0],
      duration: reser.duration,
      participants: reser.participants,
      cedula_user: reser.cedula_user,
      status: "Pendiente",
    };

    try {
      const response = await axios.post(
        "http://192.168.200.5:3002/register-reservation",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );      

      const { success } = await response.data;
      return success;
    } catch (error) {
      console.error("Error al registrar la sustancia química", error);
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
        `http://192.168.200.5:3002/accept-reservation/${id}-${cedula}`
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
        `http://192.168.200.5:3002/reject-reservation/${id}-${cedula}`
      );

      const { success } = response.data;
      return success;
    } catch (error) {
      console.error("Error al rechazar la reserva:", error);
      throw error;
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
  };
};
