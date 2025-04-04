/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Area } from "../types/Area";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { File } from "../types/Files";

const useSQData = () => {
  const [area, setArea] = useState<Area[]>([]);
  const [sq, setSq] = useState({
    nombre_comercial: "",
    descripcion: "",
    usuario_id: "",
    area_nombre: "",
    usuario_photo: "",
    usuario_nombre: "",
    id: 0,
    area_id: "",
  });
  const [areaCount, setAreaCount] = useState(0);
  const [sqCount, setSqCount] = useState(0);
  const [sustanciasQuimicas, setSustanciasQuimicas] = useState<any[]>([]);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [files, setFiles] = useState<File[]>([]);
  const userId = Cookies.get("userId");

  useEffect(() => {
    if (!userId) return; 
    
    const getData = async () => {
      try {
        const [area, areasResponse, otherResponse] = await Promise.all([
          fetch("http://10.7.167.119:3002/get-areas"),
          fetch("http://10.7.167.119:3002/get-areas-by-user/" + userId),
          fetch("http://10.7.167.119:3002/get-all-sq")
        ]);
  
        const [areasData, SQData, areas] = await Promise.all([
          areasResponse.json(),
          otherResponse.json(),
          area.json()
        ]);
  
        setArea(areasData);
        setAreaCount(areas.length);
        setSqCount(SQData.length);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };
  
    getData();
  }, [userId]);  
  
  const RegisterSQ = async (e: React.FormEvent) => {
    e.preventDefault();
    const usuario_id = Cookies.get("userId");

    if (!usuario_id) {
      console.error("Falta usuario_id.");
      return;
    }

    const data = {
      nombre_comercial: sq.nombre_comercial,
      area_id: sq.area_id,
      descripcion: sq.descripcion,
      usuario_id,
    };

    if (!data.nombre_comercial || !data.descripcion) {
      console.error("Los campos no pueden estar vacíos.");
      return;
    }

    try {
      const response = await fetch("http://10.7.167.119:3002/register-sq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.ok) {
        navigate("/basic-tables");
        getSqData();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error al registrar la sustancia química", error);
    }
  };

  const UpdateSQ = async (id: number) => {
    const data = {
      nombre_comercial: sq.nombre_comercial,
      area_id: sq.area_id,
      descripcion: sq.descripcion,
      usuario_id: sq.usuario_id,
    };

    try {
      const response = await fetch(`http://10.7.167.119:3002/update-sq/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate("/basic-tables");
        getSqData();
      }
    } catch (error) {
      console.error("Error al actualizar la sustancia química", error);
    }
  };

  const getSqData = async () => {
    try {
      const response = await fetch("http://10.7.167.119:3002/get-all-sq");
      const data = await response.json();
      setSustanciasQuimicas(data);
    } catch (error) {
      console.error("Error al obtener las sustancias químicas", error);
    }
  };

  useEffect(() => {
    getSqData();
  }, []);

  const getSQID = async (id: number) => {
    try {
      const response = await fetch(`http://10.7.167.119:3002/get-sq/${id}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setSq((prevSq) =>
          JSON.stringify(prevSq) !== JSON.stringify(data[0]) ? data[0] : prevSq
        );
      }
    } catch (error) {
      console.error("Error al obtener la sustancia química", error);
    }
  };

  const handleDetalles = (id: number) => {
    navigate(`/sq/details/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/sq/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de eliminar esta sustancia?"
    );
    if (!confirmDelete) return;
    try {
      setSuccess(false);
      const response = await fetch(`http://10.7.167.119:3002/delete-sq/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setSuccess(true);
        getSqData();

        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error al eliminar la sustancia química", error);
    }
  };

  const uploadFile = async (id: number, sustanciaName: string, area: string,  file: Blob) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("area", area);
      formData.append("sustancia", sustanciaName);

      const response = await fetch(
        `http://10.7.167.119:3002/upload-file-sq/${id}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Archivo subido con éxito");
        window.location.reload();
      } else {
        console.error("Error en la subida del archivo");
      }
    } catch (error) {
      console.error("Error al subir el archivo", error);
    }
  };

  const fetchFiles = async (id: number) => {
    try {
      const response = await fetch(`http://10.7.167.119:3002/get-files-sq/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      } else {
        console.error("Error al obtener archivos");
      }
    } catch (error) {
      console.error("Error en la petición de archivos", error);
    }
  };

  const handleDeleteFile = async (fileId: number, area: string, sustancia: string, nombre_archivo: string) => {
    if (!confirm("¿Seguro que quieres eliminar este archivo?")) return;

    try {
      const response = await fetch(
        `http://10.7.167.119:3002/delete-file/${fileId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ area, sustancia, nombre_archivo }),
        }
      );

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Error al eliminar archivo");
      }
    } catch (error) {
      console.error("Error en la eliminación del archivo", error);
    }
  };

  const HandleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSq((prevSq) => ({ ...prevSq, area_id: e.target.value }));
  };

  const HandleNombreComercialChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSq((prevSq) => ({ ...prevSq, nombre_comercial: e.target.value }));
  };

  const HandleDescripcionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSq((prevSq) => ({ ...prevSq, descripcion: e.target.value }));
  };

  const totalPages = Math.ceil(sustanciasQuimicas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedItems = sustanciasQuimicas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return {
    HandleAreaChange,
    HandleNombreComercialChange,
    HandleDescripcionChange,
    area,
    RegisterSQ,
    sq,
    getSqData,
    sustanciasQuimicas,
    areaCount,
    sqCount,
    handleDetalles,
    getSQID,
    handleDelete,
    success,
    handleEdit,
    selectedItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    UpdateSQ,
    uploadFile,
    files,
    fetchFiles,
    handleDeleteFile
  };
};

export default useSQData;