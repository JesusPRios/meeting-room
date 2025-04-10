import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useReservation } from "../../hooks/useReservation";

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
    reservedRange,
    cedulaInput,
    setCedulaInput,
    sugerencias,
    setSugerencias,
  } = useReservation();

  const isTimeOverlapping = (start: string, end: string) => {
    if (!reservedRange) return false;

    const toMinutes = (t: string) => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };

    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    const resStart = toMinutes(reservedRange.start);
    const resEnd = toMinutes(reservedRange.end);

    return !(endMin <= resStart || startMin >= resEnd);
  };

  const showTimeConflict =
    reser?.timeStart &&
    reser?.timeEnd &&
    reservedRange &&
    isTimeOverlapping(reser.timeStart, reser.timeEnd);

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
            <textarea
              required
              value={reser?.participants}
              name="participants"
              autoComplete="off"
              onChange={handleParticipantsChange}
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
              value={cedulaInput}
              name="cedula_user"
              autocomplete="off"
              placeholder="Ingrese su cédula"
              onChange={handleCedulaUserChange}
            />
            {sugerencias.length > 0 && (
              <ul className="absolute z-10 text-sm w-full bg-white border rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
                {sugerencias.map((usuario) => (
                  <li
                    key={usuario.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCedulaInput(usuario.cedula); 
                      reser.cedula_user = usuario.cedula;
                      setSugerencias([]);
                    }}
                  >
                    {usuario.name} - {usuario.cedula}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {showTimeConflict && (
          <p className="text-red-600 font-semibold text-sm my-4 col-span-2">
            ⚠️ El rango de hora seleccionado se cruza con otra reserva (
            {reservedRange?.start} - {reservedRange?.end}). Por favor, elige
            otra hora.
          </p>
        )}

        <div className="flex justify-end">
          <Button
            size="sm"
            type="submit"
            disabled={showTimeConflict ? true : false}
            className="bg-[#39A900] hover:bg-[#39A900] w-full mt-3"
          >
            Registrar
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
