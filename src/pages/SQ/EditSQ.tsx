/* eslint-disable react-hooks/exhaustive-deps */
import ComponentCard from "../../components/common/ComponentCard";
import Input from "../../components/form/input/InputField";
import useSQData from "../../hooks/useSQData";
import Button from "../../components/ui/button/Button";
import Label from "../../components/form/Label";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function EditSQ() {
  const { id } = useParams();
  const {
    getSQID,
    HandleAreaChange,
    area,
    sq,
    HandleNombreComercialChange,
    HandleDescripcionChange,
    UpdateSQ,
  } = useSQData();

  useEffect(() => {
    if (id) {
      getSQID(Number(id));
    }
  }, [id]);

  return (
    <>
      <PageBreadcrumb pageTitle="Editar información de las sustancias" />
      <div className="flex">
        <ComponentCard
          title="Información de la sustancia"
          className="w-full max-w-lg"
        >
          <form
            onSubmit={(event) => {
              event.preventDefault();
              UpdateSQ(Number(id));
            }}
          >
            <div className="space-y-6">
              <div>
                <Label>Nombre de la sustancia</Label>
                <Input
                  required
                  type="text"
                  value={sq?.nombre_comercial || ""}
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
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  onChange={HandleAreaChange}
                  value={sq?.area_id}
                >
                  <option value="">Seleccione una área</option>
                  {area.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Descripción de la sustancia</Label>
                <textarea
                  value={sq?.descripcion || ""}
                  name="descripcion"
                  placeholder="Escriba una descripción"
                  className="w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none bg-transparent text-black border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  rows={6}
                  onChange={HandleDescripcionChange}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button size="sm" className="btn-primary w-full mt-3">
                Actualizar
              </Button>
            </div>
          </form>
        </ComponentCard>
      </div>
    </>
  );
}
