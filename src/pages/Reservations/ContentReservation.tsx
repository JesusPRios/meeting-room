import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useReservation } from "../../hooks/useReservation";
import GIF from "../../../public/g0R5-unscreen.gif";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function Content() {
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
    cedulaInput,
    setCedulaInput,
    sugerencias,
    setSugerencias,
    loading,
    setLoading,
    selectedDate,
    isWeekday,
    showConflict,
    formatTimeStart,
    formatTimeEnd,
    formatReservedStart,
    formatReservedEnd,
  } = useReservation();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);

    try {
      await registerReservation(e);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentCard
      title="Reserva para sala de conferencia"
      desc="A continuación, encontrará el formulario correspondiente para registrar su reserva."
    >
      <form onSubmit={handleSubmit}>
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

          <div className="col-span-2 grid grid-cols-3 gap-4">
            <div>
              <Label>Fecha de la reunión</Label>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                filterDate={isWeekday}
                minDate={new Date()}
                placeholderText="Selecciona una fecha"
                className="h-11 w-full datepicker-input rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700"
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
            <Label>¿Reunión repetitiva?</Label>
            <select
              name="repetitive"
              required
              defaultValue={
                typeof reser?.repetitive === "boolean"
                  ? String(reser.repetitive)
                  : ""
              }
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
            >
              <option value="" disabled selected>
                Seleccione una opción
              </option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>

          {showConflict && (
            <div className="col-span-2">
              <p className="text-red-600 font-semibold text-sm my-4">
                ⚠️ El rango de hora seleccionado ({formatTimeStart} -{" "}
                {formatTimeEnd}) se superpone con otra reserva existente (
                {formatReservedStart} - {formatReservedEnd}). Por favor, elige
                un rango de horas diferente.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Button
            size="sm"
            type="submit"
            disabled={showConflict ? true : false}
            className="bg-[#39A900] hover:bg-[#39A900] w-full mt-3"
          >
            Reservar
          </Button>
        </div>
      </form>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#39A900] bg-opacity-70">
          <img src={GIF} alt="Cargando..." className="w-24 h-24" />
        </div>
      )}
    </ComponentCard>
  );
}
