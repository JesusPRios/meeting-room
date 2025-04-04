import React, { ChangeEvent, useEffect, useState } from "react";
import { Pictograma } from "../types/Pictograma";
import { useNavigate } from "react-router-dom";

const usePictograma = () => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: 0,
    nombre: "",
    foto: new Blob(),
  });
  const [pictogramas, setPictogramas] = useState<Pictograma[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getPictogramas = async () => {
      try {
        const response = await fetch("http://10.7.167.119:3002/get-pictogramas");
        const data = await response.json();
        setPictogramas(data);
      } catch (error) {
        console.error(error);
      }
    };
    getPictogramas();
  }, []);

  const handleImagePreview = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); 
      handleFileChange(file);
    } else {
      setPreviewImage(null);
    }
  };

  const handleFileChange = (file: File) => {
    setFormData((prev) => ({
      ...prev,
      foto: file,
    }));
  };

  const handleNombreChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      nombre: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.foto) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    const formDataSend = new FormData();
    formDataSend.append("nombre", formData.nombre);
    formDataSend.append("foto", formData.foto);

    try {
      const response = await fetch(
        "http://10.7.167.119:3002/register-pictograma",
        {
          method: "POST",
          body: formDataSend,
        }
      );

      const data = await response.json();

      if (data.ok) {
        alert(data.message);
        navigate("/pictogramas");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error en la petición", error);
    }
  };

  const deletePictograma = async (id: number) => {
    try {
      const response = await fetch(`http://10.7.167.119:3002/delete-pictograma/${id}`, {
        method: "DELETE", 
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (data.ok) {
        alert(data.message);
        window.location.reload(); 
        navigate("/pictogramas");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error en la petición", error);
    }
  };  
  
  return {
    handleImagePreview,
    handleNombreChange,
    previewImage,
    handleSubmit,
    pictogramas,
    deletePictograma
  };
};

export default usePictograma;