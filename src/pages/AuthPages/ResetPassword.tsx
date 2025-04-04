/* eslint-disable @typescript-eslint/no-explicit-any */
import GridShape from "../../components/common/GridShape";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert";
import { useUserData } from "../../hooks/useUserData";

export default function ResetPassword() {
  const { userData, setUserData, ResetPassword, success } = useUserData();

  const HandleSubmit = async (e: any) => {
    e.preventDefault();
    ResetPassword(userData.cedula, userData.email);
  };

  return (
    <>
      <div className="fixed top-5 right-5 z-50 ">
        {success && (
          <Alert
            variant="success"
            title="Reestablecimiento exitoso"
            message="Se ha enviado un correo electrónico con la nueva contraseña."
            showLink={true}
            linkHref="/"
            linkText="Iniciar sesión"
          />
        )}
      </div>

      <div className="relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Reestablecer contraseña
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Ingrese su número de cédula y seleccione su correo para
                  reestablecer su contraseña.
                </p>
              </div>

              <div>
                <form onSubmit={HandleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <Label>
                        Cédula <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        required
                        placeholder="Ingrese su número de cédula"
                        name="cedula"
                        autocomplete="off"
                        value={userData.cedula ?? ""}
                        onChange={(e) =>
                          setUserData({ ...userData, cedula: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>
                        Correo Electronico{" "}
                        <span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          required
                          name="email"
                          type="text"
                          placeholder="Ingrese su correo electrónico"
                          autocomplete="off"
                          value={userData.email ?? ""}
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Button className="w-full" size="sm" type="submit">
                        Recuperar contraseña
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex-col hidden items-center justify-center flex-1 p-8 z-1 bg-brand-950 dark:bg-white/5 lg:flex mt-[-60px]">
          <GridShape />
          <div className="flex flex-col items-center text-center">
            <img
              src="./images/logo-nofondo-new.png"
              alt="Logo"
              className="w-auto h-80"
            />
            <p className="text-gray-300 dark:text-white/60 max-w-xs mt-[-60px]">
              <span className="font-bold">EcoTRACK</span> es un sistema
              innovador diseñado para el monitoreo y la gestión de datos
              ambientales.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
