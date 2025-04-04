/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Area } from "../types/Area";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useDataArea = () => {
  const [data, setData] = useState<{ id?: number; name?: string }>({});
  const [area, setArea] = useState<Area[]>([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const itemsPerPage = 5;

  useEffect(() => {
    const getAreaData = async () => {
      try {
        const [response, usuariosResponse] = await Promise.all([
          axios.get("http://10.7.167.119:3002/get-areas"),
          axios.get("http://10.7.167.119:3002/get-all-users"),
        ]);
        setArea(response.data);
        setUsuarios(usuariosResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAreaData();
  }, []);

  const handleSelectUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUser(userId);
  };

  const getInformationArea = async (id: number) => {
    try {
      const response = await fetch(`http://10.7.167.119:3002/get-area/${id}`);
      const areaData = await response.json();
      setData(areaData);
  
      if (areaData.user_id) {
        setSelectedUser(String(areaData.user_id)); 
      }
    } catch (error) {
      console.error("Error obteniendo el área:", error);
    }
  };  
  
  const registerArea = async (e: any, name: string, userId: number) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://10.7.167.119:3002/register-area", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, userId }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        setArea(data);
        navigate("/area-list");
      } else {
        alert(`Error: ${data.message || "No se pudo registrar el área"}`);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error inesperado. Inténtalo de nuevo.");
    }
  };  

  const deleteArea = async (id: number) => {
    const confirm = window.confirm("¿Estás seguro de que quieres eliminar esta área?");
    if (!confirm) return;

    const response = await fetch(`http://10.7.167.119:3002/delete-area/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      window.location.reload();
    } else {
      console.log("error");
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/area-edit/${id}`);
  };

  const updateArea = async (e: any, id: number, userId: string) => {
    e.preventDefault();
    const response = await fetch("http://10.7.167.119:3002/update-area", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name: data.name, userId }),
    });

    if (response.ok) {
      navigate("/area-list");
    } else {
      console.log("error");
    }
  };

  const totalPages = Math.ceil(area.length / itemsPerPage);

  const paginatedAreas = area.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const HandleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevData) => ({ ...prevData, name: e.target.value }));
  };  

  return {
    area,
    registerArea,
    deleteArea,
    paginatedAreas,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    HandleNameChange,
    getInformationArea,
    data,
    updateArea,
    handleEdit,
    selectedUser,
    usuarios,
    handleSelectUser,
  };
};

export default useDataArea;