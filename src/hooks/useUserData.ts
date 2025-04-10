/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { User } from "../types/user";
import Cookies from "js-cookie";
import axios from "axios";

export const useUserData = () => {
  const [userData, setUserData] = useState<User>({
    id: "",
    name: "",
    cedula: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    photo: null,
  });

  const login = async (
    username: string,
    password: string,
    navigate: (path: string) => void
  ) => {
    try {
      const response = await axios.post("http://10.4.32.29:3002/login", {
        username,
        password,
      });
  
      const { success, admin } = response.data;
  
      if (!success || !admin) {
        throw new Error("Número de cédula o contraseña incorrectas");
      }
  
      const id = admin.id;
      const role = "admin" 
  
      localStorage.setItem("userId", id);
      localStorage.setItem("role", role);
      Cookies.set("userId", id, { expires: 1 });
      Cookies.set("role", role, { expires: 1 });

      navigate("/admin/home");
  
      return { success: true, admin };
    } catch (err: any) {
      throw new Error(
        err.response?.data?.error || "Número de cédula o contraseña incorrectas"
      );
    }
  };  

  const getAdmins = async (id: string) => {
    try {
      const response = await fetch(`http://10.4.32.29:3002/get-admins/${id}`); 
      const data = await response.json();
      return data.admin;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Error al obtener los admins"
      );
    }
  };

  const handleLogout = (
    navigate: (path: string, options?: { replace?: boolean }) => void
  ) => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("role");
  
    navigate("/signin", { replace: true });
  };  

  return {
    userData,
    login,
    handleLogout,
    setUserData,
    getAdmins,
  };
};