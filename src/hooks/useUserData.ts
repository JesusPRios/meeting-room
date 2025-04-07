/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { User } from "../types/user";
import Cookies from "js-cookie";
import axios from "axios";
import { useModal } from "./useModal";

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
  const [userEdited, setUserEdited] = useState<User>({
    id: "",
    name: "",
    cedula: "",
    email: "",
    password: "",
    phone: "",
    bio: "",
    photo: null,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [CountUsers, setdata] = useState(0);
  const [success, setSuccess] = useState(false);
  const { isOpen, openModal, closeModal } = useModal();

  // useEffect(() => {
  //   const getUserData = async () => {
  //     try {
  //       const response = await fetch("http://10.7.167.119:3002/get-all-users");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch users");
  //       }
  //       const data = await response.json();
  //       setUserData(data);
  //       setdata(data.length);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   getUserData();
  // }, []);

  const login = async (
    username: string,
    password: string,
    navigate: (path: string) => void
  ) => {
    try {
      const response = await axios.post("http://localhost:3002/login", {
        username,
        password,
      });

      console.log(
        username,
        password
      )
  
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

      navigate("/");
  
      return { success: true, admin };
    } catch (err: any) {
      throw new Error(
        err.response?.data?.error || "Número de cédula o contraseña incorrectas"
      );
    }
  };  

  const register = async (
    name: string,
    cedula: string,
    email: string,
    password: string,
    phone: string,
    bio: string,
    userType: string
  ) => {
    try {
      const response = await fetch("http://10.7.167.119:3002/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, cedula, email, password, phone, bio, userType }),
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      return await response.json();
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message ||
          "Número de cédula o contraseña incorrectas"
      );
    }
  };

  const getUser = async (id: string) => {
    try {
      const response = await fetch(`http://10.7.167.119:3002/get-all-users/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const data = await response.json();
      return data.user;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Error al obtener el usuario"
      );
    }
  };

  const getAdmins = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3002/get-admins/${id}`); 
      const data = await response.json();
      return data.admin;
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Error al obtener los admins"
      );
    }
  };

  const handleEditClick = (user: User) => {
    openModal();
    setUserData(user);
    setUserEdited(user); 
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userEdited) return;
    setUserEdited({
      ...userEdited,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogout = (
    navigate: (path: string, options?: { replace?: boolean }) => void
  ) => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    Cookies.remove("authToken");
    Cookies.remove("userId");
    Cookies.remove("role");
  
    navigate("/", { replace: true });
  };  

  const handleSave = async (id: string, event: React.FormEvent) => {
    event.preventDefault();

    const role = Cookies.get("role");

    if (!userEdited) return;
    try {
      const response = await fetch(`http://10.7.167.119:3002/update-user/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userEdited.name,
          cedula: userEdited.cedula,
          email: userEdited.email,
          password: userEdited.password,
          phone: userEdited.phone,
          bio: userEdited.bio,
          role: role,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update user");
      }
      window.location.reload();
      await response.json();
      closeModal();
    } catch (err: any) {
      throw new Error(
        err.response?.data?.message || "Error al actualizar el usuario"
      );
    }
  };

  const handleUserPhotoUpload = async (file: File | null, userId: number, role: string | undefined) => {
    if (!file) {
      alert("Selecciona un archivo primero.");
      return;
    }

    if (!role) {
      alert("Hubo un error al subir la foto de perfil");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("id", userId.toString());
    formData.append("role", role);

    try {
      const response = await fetch(
        `http://10.7.167.119:3002/update-photo-user/${userId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Imagen subida con éxito!");
        window.location.reload();
      }
      else {
        alert("Error al subir la imagen.");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file); 
    } else {
      setSelectedFile(null);
    }
  };  

  const ResetPassword = async (cedula: string, email: string) => {
    const password = generatePassword(); 
  
    try {
      const response = await fetch(`http://10.7.167.119:3002/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, email, password }),
      });
  
      const data = await response.json(); 
  
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          window.location.reload();
        }, 5000);
      } else {
        console.error("Error en la recuperación de contraseña:", data);
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };  
  
  const generatePassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  };
    
  return {
    userData,
    login,
    register,
    getUser,
    handleLogout,
    handleSave,
    isOpen,
    openModal,
    closeModal,
    isModalOpen,
    setIsModalOpen,
    setUserData,
    handleEditClick,
    handleInputChange,
    userEdited,
    handleUserPhotoUpload,
    handleFileChange,
    selectedFile,
    CountUsers,
    getAdmins,
    ResetPassword,
    success
  };
};