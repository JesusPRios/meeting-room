/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import GridShape from "../../components/common/GridShape";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { Link, useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert"; 
import { useUserData } from "../../hooks/useUserData";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useUserData();
  const [user, setUser] = useState({ cedula: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await login(user.cedula, user.password, navigate);
    } catch (err: any) {
      setError(err.message);
      
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <>
      <div className="fixed top-5 right-5 z-50 ">
        {error && (
          <Alert
            variant="error"
            title="Error al iniciar sesión"
            message={error}
            showLink={false}
          />
        )}
      </div>

      <div className="relative flex w-full h-screen px-4 py-6 overflow-hidden bg-white z-1 dark:bg-gray-900 sm:p-0">
        <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div>
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                  Inicio de sesión
                </h1>
                <p className="text-[13px] text-gray-500 dark:text-gray-400">
                  Ingrese su número de cédula y contraseña para acceder al sistema.
                </p>
              </div>

              <div>
                <form onSubmit={handleLogin}>
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
                        value={user.cedula}
                        onChange={(e) =>
                          setUser({ ...user, cedula: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>
                        Contraseña <span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          required
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Ingrese su contraseña"
                          autocomplete="off"
                          value={user.password}
                          onChange={(e) =>
                            setUser({ ...user, password: e.target.value })
                          }
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <IoEye className="text-gray-500 dark:text-gray-400" />
                          ) : (
                            <IoEyeOff className="text-gray-500 dark:text-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Link
                        to="/reset-password"
                        className="text-sm text-center text-brand-500 hover:text-brand-600 dark:text-brand-400"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                    <div>
                      <Button className="w-full" size="sm" type="submit">
                        Iniciar sesión
                      </Button>
                    </div>
                  </div>
                </form>

                <div className="mt-5">
                  <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                    ¿No tienes una cuenta?{" "}
                    <Link
                      to="/signup"
                      className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                    >
                      Crear una cuenta
                    </Link>
                  </p>
                </div>
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
              <span className="font-bold">EcoTRACK</span> es un sistema innovador diseñado para el monitoreo y la gestión de datos ambientales.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}