import useInventario from "../../hooks/useInventario";
import Label from "../../components/form/Label";
import Cookies from "js-cookie";
import { useUserData } from "../../hooks/useUserData";
import { Modal } from "../../components/ui/modal";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import { IoPencil, IoTrash } from "react-icons/io5";

const InfoInventario = () => {
  const {
    pictograma,
    handleTextAreaAdmin,
    updateInventario,
    handleChangeAdmin,
    formDataAdmin,
    deleteInventario,
    mensaje,
    selectedInventario,
    handleSelectChange,
    filteredSQ,
    handleSelectUser,
    selectedUser,
    usuarios,
    handleEdit,
    hanldeSelectAdmin,
    setFormDataAdmin,
  } = useInventario();
  const { isOpen, openModal, closeModal } = useUserData();
  const role = Cookies.get("role");

  const frecuenciaUsoOptions: Record<string, string> = {
    "1": "Ocasional",
    "2": "Intermitente",
    "3": "Frecuente",
    "4": "Permanente",
  };

  const procedimientoUsoOptions: Record<string, string> = {
    "1": "1. Cerrado permanentemente (poca exposición, sistema cerrado cabina de pintura)",
    "2": "2. Cerrado regularmente (alguna exposición, cabina mal cerrada)",
    "3": "3. Abierto (como pintura con brocha)",
    "4": "4. Disperso (como pintura con pistola)",
  };

  const tipoventilacionUsoOptions: Record<string, string> = {
    "1": "1. Cabina de extracción",
    "2": "2. Extracción localizada",
    "3": "3. Ventilación mecanica general",
    "4": "4. Solo ventilación natural favorable",
    "5": "5. Ventilación natural desfavorable",
    "6": "6. Sin ventilación",
  };

  const superficieCuerpoOptions: Record<string, string> = {
    "1": "1. Exposición con elementos de Protección Personal",
    "2": "2. Una Mano",
    "3": "3. Dos manos / Una mano + antebrazo",
    "4": "4. Dos manos + antebrazo / Brazo completo",
    "5": "5. Superficie que comprende los miembros superiores y torso y/o pelvis y/o las piernas",
  };

  const carcinogenicidadOptions: Record<string, string> = {
    "1": "Sin datos",
    "2": "Clase 2B",
    "3": "Clase 2A",
    "4": "Clase 1",
  };

  const toxicidadAguadaOptions: Record<string, string> = {
    "1": "Categoria 4 / No peligroso",
    "2": "Categoria 3",
    "3": "Categoria 2",
    "4": "Categoria 1",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {role === "admin" && (
          <div className="flex-1">
            <Label>Seleccionar Usuario</Label>
            <select
              onChange={handleSelectUser}
              value={selectedUser}
              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-sm focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            >
              <option value="">Seleccione un usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex-1">
          <Label>Sustancias Químicas</Label>
          <select
            onChange={handleSelectChange}
            className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-sm focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <option value="">Seleccione una sustancia</option>
            {filteredSQ.map((sustancia) => (
              <option key={sustancia.id} value={sustancia.id}>
                {sustancia.nombre_comercial}
              </option>
            ))}
          </select>
        </div>
      </div>

      {Object.keys(selectedInventario || {}).length > 0 ? (
        <div className="border dark:border-gray-700 dark:text-white/90 p-6 rounded-lg shadow-sm">
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-500 fontbold mb-2">
              Información General
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 text-[13px]">
              <div>
                <strong>Nombre Comercial:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.nombre_comercial ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Usuario Encargado:</strong>
                <input
                  type="text"
                  value={selectedInventario?.usuario_nombre ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Nombre Químico:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.nombre_quimico ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Número CAS:</strong>
                <input
                  type="text"
                  value={selectedInventario?.numero_CAS ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div className="col-span-2">
                <strong>Fabricante:</strong>
                <input
                  type="text"
                  value={selectedInventario?.fabricante ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div className="col-span-2">
                <strong>Datos del Fabricante:</strong>{" "}
                <textarea
                  value={selectedInventario?.datos_fabricante ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                  rows={5}
                />
              </div>
              <div>
                <strong>Estado Físico:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.estado_fisico ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Presentación:</strong>
                <input
                  type="text"
                  value={selectedInventario?.presentacion ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Cantidad Existente:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.cantidad_existente ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Proceso:</strong>
                <input
                  type="text"
                  value={selectedInventario?.proceso ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-500 fontbold mb-2">
              Seguridad y Riesgos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 text-[13px]">
              <div>
                <strong>Sustancia Controlada:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.sustancia_controlada ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Trasvase:</strong>
                <input
                  type="text"
                  value={selectedInventario?.trasvase ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Ficha de Seguridad Disponible:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.ficha_seguridad_disponible ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Clase de Riesgo:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.clase_riesgo ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>pH:</strong>
                <input
                  type="text"
                  value={selectedInventario?.ph}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div className="col-span-2">
                <strong>Indicaciones de Peligro:</strong>{" "}
                <textarea
                  value={selectedInventario?.indicaciones_peligro ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <strong>Consejos de Prudencia:</strong>{" "}
                <textarea
                  value={selectedInventario?.consejos_prudencia ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                  rows={5}
                />
              </div>
              <div>
                <strong>Palabra de Advertencia:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.palabra_advertencia ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Categoría de Peligro:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.categoria_peligro ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Toxicidad Aguda:</strong>{" "}
                <input
                  type="text"
                  value={
                    role === "admin"
                      ? selectedInventario?.toxicidad_aguda ?? ""
                      : toxicidadAguadaOptions[
                          selectedInventario?.toxicidad_aguda ?? ""
                        ]
                  }
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-brand-500 fontbold mb-2">
              Almacenamiento y Manipulación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 text-[13px]">
              <div>
                <strong>Frecuencia de Uso:</strong>{" "}
                <input
                  type="text"
                  value={
                    role === "admin"
                      ? selectedInventario?.frecuencia_uso ?? ""
                      : frecuenciaUsoOptions[
                          selectedInventario?.frecuencia_uso
                        ] ?? ""
                  }
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Procedimiento de Uso:</strong>{" "}
                <input
                  type="text"
                  value={
                    role === "admin"
                      ? selectedInventario?.procedimiento_uso ?? ""
                      : procedimientoUsoOptions[
                          selectedInventario?.procedimiento_uso
                        ] ?? ""
                  }
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Tipo de Ventilación:</strong>{" "}
                <input
                  type="text"
                  value={
                    role === "admin"
                      ? selectedInventario?.tipo_ventilacion ?? ""
                      : tipoventilacionUsoOptions[
                          selectedInventario?.tipo_ventilacion
                        ] ?? ""
                  }
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Superficie del Cuerpo Afectada:</strong>{" "}
                <input
                  type="text"
                  value={
                    role === "admin"
                      ? selectedInventario?.superficie_cuerpo ?? ""
                      : superficieCuerpoOptions[
                          selectedInventario?.superficie_cuerpo
                        ] ?? ""
                  }
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Carcinogenicidad:</strong>{" "}
                <input
                  type="text"
                  value={
                    role === "admin"
                      ? selectedInventario?.carcinogenicidad ?? ""
                      : carcinogenicidadOptions[
                          selectedInventario?.carcinogenicidad
                        ] ?? ""
                  }
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div className="col-span-2">
                <strong>Límites de Exposición:</strong>{" "}
                <textarea
                  value={selectedInventario?.limites_exposicion ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <strong>Elementos de Protección Personal:</strong>{" "}
                <textarea
                  value={
                    selectedInventario?.elementos_proteccion_personal ?? ""
                  }
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                  rows={3}
                />
              </div>
              <div>
                <strong>Almacenamiento:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.almacenamiento ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Puntuación:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.puntuacion ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
              <div>
                <strong>Prioridad:</strong>{" "}
                <input
                  type="text"
                  value={selectedInventario?.prioridad ?? ""}
                  readOnly
                  className="w-full border px-3 py-2 rounded-lg outline-none dark:bg-gray-900 dark:text-white/90 text-[13px]"
                />
              </div>
            </div>
          </div>

          {pictograma.length > 0 && (
            <div className="mt-4 mb-4">
              <h3 className="text-lg font-semibold text-brand-500 fontbold mb-2">
                Pictogramas
              </h3>
              <div className="flex flex-wrap gap-4 mt-2">
                {pictograma.map((p) => (
                  <div key={p.id} className="flex flex-col items-center">
                    <img
                      src={`data:image/png;base64,${p.foto}`}
                      alt={p.name}
                      className="w-24 h-24 object-contain rounded-sm"
                    />
                    {/* <span className="text-xs mt-1">{p.name}</span> */}
                  </div>
                ))}
              </div>
            </div>
          )}

          {role === "user" && (
            <div className="flex justify-end space-x-4 mt-10">
              <button
                title="Editar Inventario"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
                onClick={(e) => handleEdit(e, selectedInventario.id)}
              >
                <IoPencil size={20} />
              </button>

              <button
                title="Eliminar Inventario"
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
                onClick={(e) => deleteInventario(e, selectedInventario.id)}
              >
                <IoTrash size={20} />
              </button>
            </div>
          )}

          {role === "admin" && (
            <div className="mt-[50px]">
              <button
                onClick={openModal}
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
              >
                Completar Inventario
              </button>
              <Modal
                isOpen={isOpen}
                onClose={closeModal}
                className="max-w-[600px] m-4"
              >
                <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
                  <div className="px-2 pr-10">
                    <h4 className="mb-1 text-xl font-semibold text-gray-800 dark:text-white/90">
                      Completar información del Inventario
                    </h4>
                  </div>
                  <form
                    className="flex flex-col"
                    onSubmit={(e) => updateInventario(e, selectedInventario.id)}
                  >
                    <div className="custom-scrollbar h-[400px] overflow-y-auto px-2 pb-2">
                      <div className="mt-7">
                        <div className="grid grid-cols-1 gap-x-5 gap-y-4 lg:grid-cols-2">
                          <div>
                            <Label>Fecha de Actualización</Label>
                            <input
                              type="date"
                              name="fecha_actualizacion"
                              value={
                                formDataAdmin.fecha_actualizacion
                                  ? new Date(formDataAdmin.fecha_actualizacion)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                setFormDataAdmin({
                                  ...formDataAdmin,
                                  fecha_actualizacion: new Date(e.target.value),
                                })
                              }
                              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                              style={{
                                colorScheme: "white",
                              }}
                            />
                          </div>

                          <div>
                            <Label>Ficha de 16 secciones</Label>
                            <select
                              name="ficha_16_secciones"
                              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                              value={formDataAdmin.ficha_16_secciones}
                              onChange={hanldeSelectAdmin}
                            >
                              <option value="">Seleccione una opción</option>
                              <option value="Si">Si</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                          <div>
                            <Label>Ficha de Seguridad en Español</Label>
                            <select
                              name="ficha_en_espanol"
                              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                              value={formDataAdmin.ficha_en_espanol}
                              onChange={hanldeSelectAdmin}
                            >
                              <option value="">Seleccione una opción</option>
                              <option value="Si">Si</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                          <div>
                            <Label>Ficha con Pictogramas</Label>
                            <select
                              name="ficha_con_pictogramas"
                              className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                              value={formDataAdmin.ficha_con_pictogramas}
                              onChange={hanldeSelectAdmin}
                            >
                              <option value="">Seleccione una opción</option>
                              <option value="Si">Si</option>
                              <option value="No">No</option>
                            </select>
                          </div>

                          <div className="lg:col-span-2">
                            <Label>Número UN</Label>
                            <Input
                              type="text"
                              name="numero_UN"
                              className="w-full"
                              onChange={handleChangeAdmin}
                              value={formDataAdmin.numero_UN}
                              autocomplete="off"
                            />
                          </div>

                          <div className="lg:col-span-2">
                            <Label>Peligros Ambientales</Label>
                            <TextArea
                              name="peligros_ambientales"
                              placeholder="Elementos de protección personal"
                              onChange={(value) =>
                                handleTextAreaAdmin(
                                  "peligros_ambientales",
                                  value
                                )
                              }
                              value={formDataAdmin.peligros_ambientales}
                              rows={5}
                            />
                          </div>

                          <div className="lg:col-span-2">
                            <Label>Palabras Clave Incendios</Label>
                            <TextArea
                              name="palabras_clave_incendios"
                              placeholder="Elementos de protección personal"
                              onChange={(value) =>
                                handleTextAreaAdmin(
                                  "palabras_clave_incendio",
                                  value
                                )
                              }
                              value={formDataAdmin.palabras_clave_incendio}
                              rows={5}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 px-2 mt-4 lg:justify-end">
                      <button
                        className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
                        onClick={closeModal}
                      >
                        Cerrar
                      </button>

                      <button className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto">
                        Guardar
                      </button>
                    </div>
                  </form>
                </div>
              </Modal>
            </div>
          )}
        </div>
      ) : (
        mensaje && (
          <p className="mt-2 text-gray-400 text-sm">
            {role === "admin"
              ? "El usuario no ha registrado el inventario de esta sustancia"
              : mensaje}
          </p>
        )
      )}
    </div>
  );
};

export default InfoInventario;