/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { SQ } from "../types/SQ";
import { Pictograma } from "../types/Pictograma";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const useInventario = () => {
  const [sq, setSQ] = useState<SQ[]>([]);
  const [step, setStep] = useState(1);
  const [pictograma, setPictograma] = useState<Pictograma[]>([]);
  const [selectedPictogramas, setSelectedPictogramas] = useState<number[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [selectedInventario, setSelectedInventario] = useState<any>(null);
  const [formData, setFormData] = useState({
    sustancia_id: 0,
    nombre_comercial: "",
    usuario_nombre: "",
    nombre_quimico: "",
    numero_CAS: "",
    proceso: "",
    fabricante: "",
    datos_fabricante: "",
    estado_fisico: "",
    presentacion: "",
    cantidad_existente: "",
    sustancia_controlada: "",
    trasvase: "",
    ficha_seguridad_disponible: "",
    clase_riesgo: "",
    ph: "",
    pictograma_id: 0,
    indicaciones_peligro: "",
    consejos_prudencia: "",
    palabra_advertencia: "",
    categoria_peligro: "",
    toxicidad_aguda: "",
    frecuencia_uso: "",
    procedimiento_uso: "",
    tipo_ventilacion: "",
    superficie_cuerpo: "",
    carcinogenicidad: "",
    limites_exposicion: "",
    elementos_proteccion_personal: "",
    almacenamiento: "",
    puntuacion: "",
    prioridad: "",
  });
  const [formDataAdmin, setFormDataAdmin] = useState({
    fecha_actualizacion: new Date(),
    ficha_16_secciones: "",
    ficha_en_espanol: "",
    ficha_con_pictogramas: "",
    numero_UN: "",
    peligros_ambientales: "",
    palabras_clave_incendio: "",
  });
  const navigate = useNavigate();
  const [filteredSQ, setFilteredSQ] = useState<SQ[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const role = Cookies.get("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sq, pictograma, usuariosResponse] = await Promise.all([
          axios.get("http://10.7.167.119:3002/get-all-sq"),
          axios.get("http://10.7.167.119:3002/get-pictogramas"),
          axios.get("http://10.7.167.119:3002/get-all-users"),
        ]);

        setSQ(sq.data);
        setPictograma(pictograma.data);
        setUsuarios(usuariosResponse.data);
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };
    fetchData();
  }, []);

  const handleSelectUser = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUser(userId);
    setFilteredSQ(
      sq.filter((sustancia) => sustancia.usuario_id === parseInt(userId, 10))
    );
  };

  const handleSelectChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedId = parseInt(e.target.value, 10);
    await getInfoInventario(selectedId);
  };

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeAdmin = (e: any) => {
    setFormDataAdmin({
      ...formDataAdmin,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextArea = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextAreaAdmin = (name: string, value: string) => {
    setFormDataAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const hanldeSelectAdmin = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDataAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectPictograma = (id: number) => {
    setSelectedPictogramas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const validateStep = () => {
    const errors = [];
  
    if (step === 1) {
      if (!formData.sustancia_id) errors.push("Seleccione una sustancia.");
      if (!formData.nombre_quimico) errors.push("Ingrese el nombre químico.");
      if (!formData.numero_CAS) errors.push("Ingrese el número CAS.");
      if (!formData.proceso) errors.push("Ingrese el proceso.");
    } else if (step === 2) {
      if (!formData.fabricante) errors.push("Ingrese el fabricante.");
      if (!formData.datos_fabricante) errors.push("Ingrese los datos del fabricante.");
      if (!formData.estado_fisico) errors.push("Seleccione el estado físico.");
      if (!formData.presentacion) errors.push("Ingrese la presentación.");
    } else if (step === 3) {
      if (!formData.cantidad_existente) errors.push("Ingrese la cantidad existente.");
      if (!formData.sustancia_controlada) errors.push("Seleccione si es una sustancia controlada.");
      if (!formData.trasvase) errors.push("Seleccione si hay trasvase.");
      if (!formData.ficha_seguridad_disponible) errors.push("Seleccione si hay ficha de seguridad.");
    } else if (step === 4) {
      if (!formData.clase_riesgo) errors.push("Seleccione una clase de riesgo.");
      if (!formData.ph) errors.push("Ingrese el pH.");
      if (selectedPictogramas.length === 0) errors.push("Seleccione al menos un pictograma.");
      if (!formData.indicaciones_peligro) errors.push("Ingrese indicaciones de peligro.");
    } else if (step === 5) {
      if (!formData.consejos_prudencia) errors.push("Ingrese consejos de prudencia.");
      if (!formData.palabra_advertencia) errors.push("Ingrese la palabra de advertencia.");
      if (!formData.categoria_peligro) errors.push("Ingrese la categoría de peligro.");
      if (!formData.toxicidad_aguda) errors.push("Seleccione la toxicidad aguda.");
    } else if (step === 6) {
      if (!formData.frecuencia_uso) errors.push("Seleccione la frecuencia de uso.");
      if (!formData.procedimiento_uso) errors.push("Seleccione el procedimiento de uso.");
      if (!formData.tipo_ventilacion) errors.push("Seleccione el tipo de ventilación.");
      if (!formData.superficie_cuerpo) errors.push("Seleccione la superficie del cuerpo expuesta.");
    } else if (step === 7) {
      if (!formData.carcinogenicidad) errors.push("Seleccione la carcinogenicidad.");
      if (!formData.limites_exposicion) errors.push("Ingrese los límites de exposición.");
      if (!formData.elementos_proteccion_personal) errors.push("Ingrese los elementos de protección personal.");
      if (!formData.almacenamiento) errors.push("Seleccione si se almacena.");
    }
  
    if (errors.length > 0) {
      alert(errors.join("\n")); 
      return;
    }
  
    nextStep();
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const errors = [];

    if (!formData.carcinogenicidad) errors.push("Seleccione la carcinogenicidad.");
    if (!formData.limites_exposicion) errors.push("Ingrese los límites de exposición.");
    if (!formData.elementos_proteccion_personal) errors.push("Ingrese los elementos de protección personal.");
    if (!formData.almacenamiento) errors.push("Seleccione si se almacena.");

    if (errors.length > 0) {
      alert(errors.join("\n")); 
      return;
    }

    const value = parseInt(formData.toxicidad_aguda);
    const value2 = parseInt(formData.frecuencia_uso);
    const value3 = parseInt(formData.procedimiento_uso);
    const value4 = parseInt(formData.tipo_ventilacion);
    const value5 = parseInt(formData.superficie_cuerpo);
    const value6 = parseInt(formData.carcinogenicidad);

    const totalPuntuacion = value * value2 * value3 * value4 * value5 * value6;

    let prioridad = "Baja";
    if (totalPuntuacion >= 1500 && totalPuntuacion < 2000) {
      prioridad = "Media";
    } else if (totalPuntuacion >= 4000) {
      prioridad = "Elevada";
    }

    const data = {
      ...formData,
      prioridad,
      pictograma_id: selectedPictogramas,
      puntuacion: totalPuntuacion,
    };

    try {
      const response = await fetch("http://10.7.167.119:3002/create-inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        navigate("/inventario-info");
      }
    } catch (error) {
      console.error("Error al crear la área", error);
    }
  };

  const handleChangeSQ = (e: any) => {
    const selectedId = e.target.value;
    const selectedSustancia = sq.find((s) => s.id === parseInt(selectedId));

    setFormData({
      ...formData,
      sustancia_id: selectedId,
      nombre_comercial: selectedSustancia
        ? selectedSustancia.nombre_comercial
        : "",
    });
  };

  const getInfoInventario = async (id: number) => {
    try {
      const response = await axios.get(
        `http://10.7.167.119:3002/get-info-inventario/${id}`
      );

      const inventario = response.data.inventario;
      const pictogramas = response.data.pictogramasWithBase64Content;

      if (!inventario || Object.keys(inventario).length === 0) {
        setMensaje("No ha registrado el inventario de esta sustancia.");
        setSelectedInventario(null);
      } else {
        setMensaje("");
      }

      setFormData((prev) => ({
        ...prev,
        ...inventario,
        sustancia_id: id,
      }));
      
      setFormDataAdmin(inventario);
      setSelectedInventario(inventario || {});
      setPictograma(pictogramas || []);
    } catch (error) {
      console.error("Error al obtener la información del inventario", error);
      setMensaje("Error al obtener la información del inventario.");

      setFormData((prev) => ({
        ...prev,
        sustancia_id: id,
      }));
    }
  };

  const updateInventario = async (e: any, id: number) => {
    e.preventDefault();

    const fechaFormat = formDataAdmin.fecha_actualizacion.toISOString().split("T")[0];

    const dataSend = {
      fecha_actualizacion: fechaFormat,
      ficha_16_secciones: formDataAdmin.ficha_16_secciones,
      ficha_en_espanol: formDataAdmin.ficha_en_espanol,
      ficha_con_pictogramas: formDataAdmin.ficha_con_pictogramas,
      numero_UN: formDataAdmin.numero_UN,
      peligros_ambientales: formDataAdmin.peligros_ambientales,
      palabras_clave_incendios: formDataAdmin.palabras_clave_incendio,
    };

    try {
      const response = await fetch(
        `http://10.7.167.119:3002/update-inventario/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataSend),
        }
      );

      if (response.ok) {
        alert("Se actualizo el inventario");
        // go to back 
        navigate("/inventario-info");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al actualizar la información del inventario", error);
    }
  };

  const handleEdit = (e: any, id: number) => {
    e.preventDefault();
    navigate(`/edit-inventario/${id}`);
  };

  const GetInformationInventario = async (id: number) => {
    try {
      const response = await axios.get(
        `http://10.7.167.119:3002/get-info-all-inventory/${id}`
      );
      const inventario = response.data.inventario;
      const pictogramas = response.data.pictogramas;
      setFormData((prev) => ({
        ...prev,
        ...inventario,
      }));
      setPictograma(pictogramas || []);
      const pictogramaIds = pictogramas.map((p: any) => p.id);
      setSelectedPictogramas(pictogramaIds);
    } catch (error) {
      console.error("Error al obtener la información del inventario", error);
    }
  };

  const UpdateInventarioInfo = async (e: any, id: number) => {
    e.preventDefault();

    const value = parseInt(formData.toxicidad_aguda);
    const value2 = parseInt(formData.frecuencia_uso);
    const value3 = parseInt(formData.procedimiento_uso);
    const value4 = parseInt(formData.tipo_ventilacion);
    const value5 = parseInt(formData.superficie_cuerpo);
    const value6 = parseInt(formData.carcinogenicidad);

    const totalPuntuacion = value * value2 * value3 * value4 * value5 * value6;

    let prioridad = "Baja";
    if (totalPuntuacion >= 1500 && totalPuntuacion < 2000) {
      prioridad = "Media";
    } else if (totalPuntuacion >= 4000) {
      prioridad = "Alta";
    }

    const data = {
      ...formData,
      prioridad,
      pictograma_id: selectedPictogramas,
      puntuacion: totalPuntuacion,
    };

    try {
      const response = await fetch(
        `http://10.7.167.119:3002/update-inventario-user/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Inventario actualizado con éxito");
        navigate("/inventario-info");
      }
    } catch (error) {
      console.error("Error al actualizar la información del inventario", error);
    }
  };

  const deleteInventario = async (e: any, id: number) => {
    e.preventDefault();

    const confirm = window.confirm("¿Estás seguro de eliminar el inventario?");

    if (!confirm) {
      return;
    }

    try {
      const response = await fetch(
        `http://10.7.167.119:3002/delete-inventory/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        alert("Inventario eliminado con éxito");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al eliminar el inventario", error);
    }
  };

  return {
    sq,
    step,
    formData,
    handleChange,
    nextStep,
    prevStep,
    handleSubmit,
    pictograma,
    handleSelect,
    handleSelectPictograma,
    selectedPictogramas,
    handleTextArea,
    handleChangeSQ,
    getInfoInventario,
    updateInventario,
    deleteInventario,
    mensaje,
    handleChangeAdmin,
    formDataAdmin,
    selectedInventario,
    setSelectedInventario,
    handleSelectChange,
    filteredSQ: role === "admin" ? filteredSQ : sq,
    handleSelectUser,
    selectedUser,
    usuarios,
    handleEdit,
    GetInformationInventario,
    UpdateInventarioInfo,
    hanldeSelectAdmin,
    handleTextAreaAdmin,
    setFormDataAdmin,
    validateStep
  };
};

export default useInventario;