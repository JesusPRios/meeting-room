/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Button from "../../components/ui/button/Button";
import Alert from "../../components/ui/alert/Alert";
import { useUserData } from "../../hooks/useUserData";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useUserData();
  const [user, setUser] = useState({ username: "ADMIN", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      await login(user.username, user.password, navigate);
    } catch (err: any) {
      setError(err.message);

      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  return (
    <>
      <div className="fixed top-5 right-5 z-50">
        {error && (
          <Alert
            variant="error"
            title="Error al iniciar sesión"
            message={error}
            showLink={false}
          />
        )}
      </div>

      <div className="relative flex w-full h-screen px-4 py-6 overflow-hidden bg-[#39A900] z-1 sm:p-0">
        <div className="flex flex-col flex-1 p-6 rounded-2xl sm:rounded-none sm:border-0 sm:p-8">
          <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
            <div className="bg-white p-10 rounded-md shadow-md">
              <div className="mb-5 sm:mb-8">
                <h1 className="mb-2 font-bold uppercase text-sena-gray text-center text-2xl">
                  Iniciar sesión
                </h1>
                <p className="text-[13px] text-sena-gray text-center">
                  Ingrese su usuario y contraseña para acceder al sistema.
                </p>
              </div>

              <form onSubmit={handleLogin}>
                <div className="space-y-6">
                  <div>
                    <Label className="text-sena-gray">
                      Usuario <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      required
                      name="username"
                      autocomplete="off"
                      value={user.username}
                      readOnly={true}
                      onChange={(e) =>
                        setUser({...user, username: e.target.value})
                      }
                      className="border-sena-lightGray text-sena-gray"
                    />
                  </div>

                  <div>
                    <Label className="text-sena-gray">
                      Contraseña <span className="text-red-600">*</span>
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
                        className="border-sena-lightGray text-sena-gray"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                      >
                        {showPassword ? (
                          <IoEye className="text-sena-gray" />
                        ) : (
                          <IoEyeOff className="text-sena-gray" />
                        )}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Button
                      size="sm"
                      type="submit"
                      className="w-full bg-[#39A900] hover:bg-[#2E7D00] text-white"
                    >
                      Iniciar sesión
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
