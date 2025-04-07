import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import Button from "../../ui/button/Button";
import { useReservation } from "../../../hooks/useReservation";

export default function DefaultInputs() {
  const {
    registerReservation,
    reser,
    handleReasonChange,
    handleDateChange,
    handleTimeStartChange,
    handleTimeEndChange,
    handleDurationChange,
    handleParticipantsChange,
    handleCedulaUserChange,
  } = useReservation();


  return (
    <ComponentCard
      title="Reserva para sala de conferencia"
      desc="A continuación, encontrara el formulario correspondiente para registrar su reserva."
    >
      <form onSubmit={registerReservation}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label>Razón o motivo de la reunión</Label>
            <textarea
              required
              value={reser?.reason}
              name="reason"
              autoComplete="off"
              placeholder="Escriba el motivo de la reunión"
              onChange={handleReasonChange}
              rows={5}
              className="bg-transparent text-black border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none"
            />
          </div>

          <div>
            <Label>Fecha de la reunión</Label>
            <Input
              required
              type="date"
              value={reser?.date ? reser.date.toISOString().split("T")[0] : ""}
              name="date"
              autocomplete="off"
              onChange={handleDateChange}
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
              onChange={handleTimeStartChange}
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
              onChange={handleTimeEndChange}
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
              onChange={handleDurationChange}
            />
          </div>

          <div>
            <Label>Participantes</Label>
            <Input
              required
              type="text"
              value={reser?.participants}
              name="participants"
              autocomplete="off"
              // readOnly={true}
              onChange={handleParticipantsChange}
            />
          </div>
          <div>
            <Label>Cédula del usuario</Label>
            <Input
              required
              type="text"
              value={reser?.cedula_user}
              name="cedula_user"
              autocomplete="off"
              // readOnly={true}
              placeholder="Ingrese su cédula"
              onChange={handleCedulaUserChange}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            type="submit"
            className="bg-[#39A900] hover:bg-[#39A900] w-full mt-3"
          >
            Registrar
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
