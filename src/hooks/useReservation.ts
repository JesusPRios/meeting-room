import { Reservation } from "./../types/Reservation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "../components/ui/alert/Alert";

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

  useEffect(() => {
    const getReservation = async () => {
      try {
        const [response] = await Promise.all([
          axios.get("http://localhost:3002/get-reservation"),
        ]);
        setReservation(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getReservation();
  }, []);

  useEffect(() => {
    if (reser.timeStart && reser.timeEnd) {
      const [startHour, startMin] = reser.timeStart.split(":").map(Number);
      const [endHour, endMin] = reser.timeEnd.split(":").map(Number);

      const start = new Date(0, 0, 0, startHour, startMin);
      const end = new Date(0, 0, 0, endHour, endMin);

      let diff = (end.getTime() - start.getTime()) / (1000 * 60); // minutos

      if (diff < 0) diff += 24 * 60; // por si pasa de medianoche

      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;

      const durationStr = `${hours}h ${minutes}min`;

      setReser(prev => ({ ...prev, duration: durationStr }));
    }
  }, [reser.timeStart, reser.timeEnd]);

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReser((prevInformation) => ({
      ...(prevInformation || {}),
      reason: e.target.value,
    }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReser((prevInformation) => ({
      ...(prevInformation || {}),
      date: new Date(e.target.value),
    }));
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

  const handleParticipantsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        `http://localhost:3002/get-reservation-by-date/${formattedDate}`
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
      const response = await fetch("http://localhost:3002/register-reservation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert({
          title: "Reserva registrada",
          message: "La reserva se ha registrado correctamente.",
          variant: "success",
        })
      }
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
    formatTime
  };
};
