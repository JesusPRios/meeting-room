import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import useSQData from "../../../hooks/useSQData";
import Button from "../../ui/button/Button";

export default function DefaultInputs() {
  const {
    RegisterSQ,
    HandleAreaChange,
    area,
    sq,
    HandleNombreComercialChange,
    HandleDescripcionChange,
  } = useSQData();

  return (
    <ComponentCard title="Información de las sustancias">
      <form onSubmit={RegisterSQ}>
        <div className="space-y-6">
          <div>
            <Label>Nombre de la sustancia</Label>
            <Input
              required
              type="text"
              value={sq.nombre_comercial}
              name="nombre_comercial"
              autocomplete="off"
              placeholder="Escriba el nombre de la sustancia"
              onChange={HandleNombreComercialChange}
            />
          </div>
          <div>
            <Label>Seleccione el área</Label>
            <select
              required
              autoComplete="off"
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
              onChange={HandleAreaChange}
            >
              <option value="">Seleccione una área</option>
              {area.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Descripción de la sustancia</Label>
            <textarea
              value={sq.descripcion}
              name="descripcion"
              placeholder="Escriba una descripción"
              className="bg-transparent text-black border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-80bg-transparent rk:focus:border-brand-80 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none"
              rows={6}
              onChange={HandleDescripcionChange}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button size="sm" type="submit" className="btn-primary w-full mt-3">
            Registrar
          </Button>
        </div>
      </form>
    </ComponentCard>
  );
}
