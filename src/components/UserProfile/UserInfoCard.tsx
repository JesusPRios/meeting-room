import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useUserData } from "../../hooks/useUserData";

export default function UserInfoCard() {
  const {
    getUser,
    handleSave,
    closeModal,
    isOpen,
    handleEditClick,
    userData,
    setUserData,
    userEdited,
    handleInputChange,
    getAdmins,
  } = useUserData();
  const id = Cookies.get("userId");
  const role = Cookies.get("role");

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          let data;
          if (role === "admin") {
            data = await getAdmins(id);
          } else {
            data = await getUser(id);
          }

          if (data && data.success !== false) {
            setUserData(data);
          }
        } catch (error) {
          console.error("Error al obtener los datos:", error);
        }
      };

      fetchData();
    }
  }, [getUser, getAdmins, id, role, setUserData]);

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg mb-6 font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Información Personal
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Nombre Completo
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Cédula
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.cedula}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Contraseña
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.password}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Correo Electrónico
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Télefono
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.phone}
              </p>
            </div>

            <div>
              <p className="mb-2 text-sm leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userData?.bio}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => handleEditClick(userData)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Actualizar
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[600px] m-4">
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
          <div className="px-2 pr-10">
            <h4 className="mb-1 text-xl font-semibold text-gray-800 dark:text-white/90">
              Editar Información Personal
            </h4>
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              Actualice su información personal aquí para mantenerla
              actualizada.
            </p>
          </div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 pb-2">
              <div className="mt-7">
                <div className="grid grid-cols-1 gap-x-5 gap-y-4 lg:grid-cols-2">
                  <div>
                    <Label>Nombre Completo</Label>
                    <Input
                      type="text"
                      name="name"
                      value={userEdited.name}
                      onChange={handleInputChange}
                      autocomplete="off"
                    />
                  </div>

                  <div>
                    <Label>Cédula</Label>
                    <Input
                      type="text"
                      name="cedula"
                      value={userEdited?.cedula}
                      onChange={handleInputChange}
                      autocomplete="off"
                    />
                  </div>

                  <div>
                    <Label>Correo Electronico</Label>
                    <Input
                      type="text"
                      name="email"
                      value={userEdited?.email}
                      onChange={handleInputChange}
                      autocomplete="off"
                    />
                  </div>

                  <div>
                    <Label>Teléfono</Label>
                    <Input
                      type="text"
                      name="phone"
                      value={userEdited?.phone}
                      onChange={handleInputChange}
                      autocomplete="off"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input
                      type="text"
                      name="bio"
                      value={userEdited?.bio}
                      onChange={handleInputChange}
                      autocomplete="off"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Contraseña</Label>
                    <Input
                      type="text"
                      name="password"
                      value={userEdited?.password}
                      onChange={handleInputChange}
                      autocomplete="off"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-4 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cerrar
              </Button>
              <button 
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
                onClick={(event) => id && handleSave(id, event)}>
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}