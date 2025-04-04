/* eslint-disable @typescript-eslint/no-explicit-any */
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import useDataArea from "../../hooks/useArea";

const RegisterArea = () => {
  const { registerArea, usuarios, selectedUser, handleSelectUser } =
    useDataArea();

  const handleSubmit = (e: any) => {
    registerArea(e, e.target.name.value, Number(selectedUser));
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Registrar de áreas" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ComponentCard title="Informacion del área">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label>Nombre del área</Label>
              <Input
                type="text"
                name="name"
                autocomplete="off"
                className="w-full p-3 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                placeholder="Ingresar nombre del área"
              />
            </div>
            <div className="flex-1">
              <Label>Asignar Usuario</Label>
              <select
                onChange={handleSelectUser}
                value={selectedUser}
                className="h-11 w-full p-3 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
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
              Registrar
            </Button>
          </form>
        </ComponentCard>
      </div>
    </>
  );
};

export default RegisterArea;
