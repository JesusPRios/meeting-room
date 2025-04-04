/* eslint-disable react-hooks/exhaustive-deps */
import { useParams } from "react-router-dom";
import useDataArea from "../../hooks/useArea";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { useEffect } from "react";
import ComponentCard from "../../components/common/ComponentCard";

export default function EditArea() {
  const { id } = useParams();
  const {
    data,
    HandleNameChange,
    getInformationArea,
    updateArea,
    usuarios,
    selectedUser,
    handleSelectUser,
  } = useDataArea();

  useEffect(() => {
    if (id) {
      getInformationArea(Number(id));
    }
  }, [id]);

  return (
    <>
      <PageBreadcrumb pageTitle="Editar área" />
      <ComponentCard title="Informacion del área">
        <form
          onSubmit={(e) => {
            updateArea(e, Number(id), selectedUser);
          }}
        >
          <div className="mb-4">
            <Label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Nombre del área
            </Label>
            <Input
              type="text"
              value={data?.name || ""}
              name="name"
              required
              autocomplete="off"
              className="w-full p-3 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
              placeholder="Ingresar nombre del área"
              onChange={HandleNameChange}
            />
          </div>
          <div className="flex-1 mt-5">
            <Label
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >Seleccionar Usuario</Label>
            <select
              onChange={handleSelectUser}
              value={selectedUser}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-sm focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="">Seleccione un usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
          >
            Actualizar
          </Button>
        </form>
      </ComponentCard>
    </>
  );
}
