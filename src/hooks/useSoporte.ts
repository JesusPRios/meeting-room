/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { User } from "../types/user";
import { Admin } from "../types/Admins";

export const useSoporte = () => {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [users, setUsers] = useState<User>({
    id: "",
    name: "",
    email: "",
    phone: "",
    bio: "",
    password: "",
    cedula: "",
    photo: "",
  });
  const [admin, setAdmin] = useState<Admin>({
    id: "",
    name: "",
    email: "",
    password: "",
    cedula: "",
    phone: "",
    bio: "",
    photo: "",
  });
  const id = Cookies.get("userId");
  const role = Cookies.get("role");

  useEffect(() => {
    const getUsers = async () => {
      if (!role || !id) return;

      try {
        const endpoint =
          role === "user"
            ? `http://10.7.167.119:3002/get-user-all/${id}`
            : `http://10.7.167.119:3002/get-admin-all/${id}`;

        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Error en la solicitud");

        const data = await response.json();

        if (role === "user") setUsers(data);
        else if (role === "admin") setAdmin(data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    getUsers();
  }, [role, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (role === "admin") {
      setAdmin((prevAdmin) => ({ ...prevAdmin, [name]: value }));
    } else {
      setUsers((prevUsers) => ({ ...prevUsers, [name]: value }));
    }
  };

  const handleChangeMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e: any, name: string, email: string, mensaje: string) => {
    e.preventDefault();
    const data = {
      nombre: name,
      email: email,
      mensaje: mensaje,
    };

    try {
      const response = await fetch("http://10.7.167.119:3002/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Mensaje enviado. Nos pondremos en contacto contigo pronto.");
        window.location.reload();
      } else {
        console.error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  const faqs = [
    {
      question: "¿Cómo recupero mi contraseña?",
      answer:
        "Puedes restablecerla desde la página de inicio de sesión haciendo clic en '¿Olvidaste tu contraseña?'. Dónde deberás ingresar tu cédula y correo electrónico para recibir la nueva contraseña.",
    },
    {
      question: "¿Cómo generar el reporte de inventario?",
      answer:
        "En el panel de administrador, accede a la sección 'Inventario' y haz clic en 'Reporte de Inventario, por consiguiente verá una vista con un boton para generar el documento.",
    },
    {
      question: "¿Cómo generar la matriz de Compatibilidad?",
      answer:
        "En el panel de administrador, accede a la sección 'Inventario' y haz clic en 'Matriz de Compatibilidad' por consiguiente verá una vista con un boton para generar el documento.",
    },
  ];

  return {
    form,
    handleChange,
    handleChangeMessage,
    faqs,
    openFAQ,
    setOpenFAQ,
    users,
    admin,
    sendEmail,
  };
};