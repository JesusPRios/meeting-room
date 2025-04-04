/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Link } from "react-router-dom";
import GridShape from "../../components/common/GridShape";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useUserData } from "../../hooks/useUserData";
import Alert from "../../components/ui/alert/Alert";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useUserData();
  const [user, setUser] = useState({
    name: "",
    cedula: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    userType: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      await register(
        user.name,
        user.cedula,
        user.email,
        user.password,
        user.phone,
        user.bio,
        user.userType
      );
      setSuccess(true);

      setUser({
        name: "",
        cedula: "",
        email: "",
        password: "",
        phone: "",
        bio: "",
        userType: "",
      });
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
            title="Error al registrar"
            message={error}
            showLink={false}
          />
        )}
        {success && (
          <Alert
            variant="success"
            title="Registro exitoso"
            message="¡Gracias por registrarte! Ahora puedes iniciar sesión."
            showLink={true}
            linkHref="/"
            linkText="Iniciar sesión"
          />
        )}
      </div>
      <div className="relative flex w-full h-screen overflow-hidden bg-white z-1 dark:bg-gray-900">
        <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div className="mb-5 sm:mb-8">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                Registro de usuario
              </h1>
              <p className="text-[13px] text-gray-500 dark:text-gray-400">
                Ingrese los siguientes datos para registrarse en el sistema.
              </p>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <Label>
                        Nombre <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        required
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Ingrese su nombre"
                        value={user.name}
                        onChange={(e) =>
                          setUser({ ...user, name: e.target.value })
                        }
                        autocomplete="off"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Label>
                        Cédula <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        required
                        type="text"
                        id="cedula"
                        name="cedula"
                        placeholder="Ingrese su cédula"
                        value={user.cedula}
                        onChange={(e) =>
                          setUser({ ...user, cedula: e.target.value })
                        }
                        autocomplete="off"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Label>
                        Teléfono <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        required
                        type="text"
                        id="phone"
                        name="phone"
                        placeholder="Ingrese su teléfono"
                        value={user.phone}
                        onChange={(e) =>
                          setUser({ ...user, phone: e.target.value })
                        }
                        autocomplete="off"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Label>
                        Bio <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        required
                        type="text"
                        id="bio"
                        name="bio"
                        placeholder="Ingrese su ocupación"
                        value={user.bio}
                        onChange={(e) =>
                          setUser({ ...user, bio: e.target.value })
                        }
                        autocomplete="off"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <Label>
                        Correo Electronico{" "}
                        <span className="text-error-500">*</span>
                      </Label>
                      <Input
                        required
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Ingrese su correo"
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                        autocomplete="off"
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <Label>
                        Tipo de Usuario{" "}
                        <span className="text-error-500">*</span>
                      </Label>
                      <select
                        required
                        id="userType"
                        name="userType"
                        value={user.userType}
                        onChange={(e) =>
                          setUser({ ...user, userType: e.target.value })
                        }
                        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring dark:bg-gray-900  dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/10 dark:border-gray-700 dark:text-white/90 dark:focus:border-brand-800"
                      >
                        <option value=" Seleccione su tipo de usuario">
                          Tipo de usuario
                        </option>
                        <option value="administrador">Administrador</option>
                        <option value="instructor">Instructor</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label>
                      Contraseña <span className="text-error-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        required
                        name="password"
                        placeholder="Ingrese su contraseña"
                        value={user.password}
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                        type={showPassword ? "text" : "password"}
                        autocomplete="off"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <IoEye className="fill-gray-500 dark:fill-gray-400" />
                        ) : (
                          <IoEyeOff className="fill-gray-500 dark:fill-gray-400" />
                        )}
                      </span>
                    </div>
                  </div>
                  <div>
                    <button type="submit" className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600">
                      Crear Cuenta
                    </button>
                  </div>
                </div>
              </form>
              <div className="mt-3">
                <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                  ¿Tienes cuenta?{" "}
                  <Link
                    to="/"
                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Iniciar sesión
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden flex-col items-center justify-center flex-1 p-8 z-1 bg-brand-950 dark:bg-white/5 lg:flex mt-[-60px]">
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
