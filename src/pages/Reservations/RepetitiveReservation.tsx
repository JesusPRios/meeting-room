/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { useReservation } from "../../hooks/useReservation";
import { useEffect } from "react";

export default function RepetitiveReservation() {
  const { id } = useParams();
  const {
    reser,
    handleDateChange,
    getReservationById,
    updateDateReservation,
  } = useReservation();

  useEffect(() => {
    if (id) {
      getReservationById(Number(id));
    }
  }, [id]);

  return (
    <ComponentCard
      title="Reagendar reserva para sala de conferencia"
      desc="Para reagendar la reunión, seleccione una fecha diferente a la original."
    >
      <form onSubmit={(e) => updateDateReservation(e, Number(id))}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Razón o motivo de la reunión</Label>
            <textarea
              required
              value={reser?.reason}
              name="reason"
              autoComplete="off"
              placeholder="Escriba el motivo de la reunión"
              readOnly={true}
              rows={5}
              className="bg-transparent text-black border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none"
            />
          </div>

          <div>
            <Label>Fecha de la reunión</Label>
            <Input
              required
              type="date"
              name="date"
              value={reser?.date ? new Date(reser.date).toISOString().split('T')[0] : ''}
              autocomplete="off"
              onChange={(e) => {
                handleDateChange(e);
              }}
            />
          </div>
          <div>
            <Label>Hora de inicio</Label>
            <Input
              required
              type="time"
              value={reser?.timeStart}
              name="timeStart"
              autocomplete="off"
              readOnly={true}
            />
          </div>

          <div>
            <Label>Hora de fin</Label>
            <Input
              required
              type="time"
              value={reser?.timeEnd}
              name="timeEnd"
              autocomplete="off"
              readOnly={true}
            />
          </div>
          <div>
            <Label>Duración</Label>
            <Input
              required
              type="text"
              value={reser?.duration}
              name="duration"
              autocomplete="off"
              readOnly={true}
            />
          </div>

          <div>
            <Label>Participantes</Label>
            <textarea
              required
              value={reser?.participants}
              name="participants"
              autoComplete="off"
              readOnly={true}
              placeholder="Escriba los nombres de los participantes"
              rows={5}
              className="bg-transparent text-black border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none"
            />
          </div>
          <div className="relative">
            <Label>Cédula del usuario</Label>
            <Input
              required
              type="text"
              value={reser?.cedula_user}
              name="cedula_user"
              autocomplete="off"
              placeholder="Ingrese su cédula"
              readOnly={true}
            />
          </div>

          <div className="relative">
            <Label>¿Reunión repetitiva?</Label>
            <select
              name="repetitive"
              required
              value={
                reser?.repetitive !== undefined
                  ? String(Boolean(reser.repetitive))
                  : ""
              }
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option value="" disabled>
                Seleccione una opción
              </option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            type="submit"
            className="bg-[#39A900] hover:bg-[#39A900] w-full mt-3"
          >
            Reagendar
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
