/* eslint-disable react-hooks/exhaustive-deps */
import ComponentCard from "../../components/common/ComponentCard";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import useInventario from "../../hooks/useInventario";
import {
  IoAddCircleOutline,
  IoCheckmark,
  IoCheckmarkCircle,
} from "react-icons/io5";
import TextArea from "../../components/form/input/TextArea";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const EditInventario = () => {
  const { id } = useParams();
  const {
    sq,
    step,
    handleChange,
    nextStep,
    prevStep,
    formData,
    pictograma,
    UpdateInventarioInfo,
    handleSelect,
    handleSelectPictograma,
    selectedPictogramas,
    handleTextArea,
    handleChangeSQ,
    GetInformationInventario,
  } = useInventario();

  useEffect(() => {
    GetInformationInventario(Number(id));
  }, [id]);

  return (
    <ComponentCard title="Edición de Inventario">
      <form onSubmit={(e) => UpdateInventarioInfo(e, Number(id))}>
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <Label>Nombre Comercial</Label>
              <select
                required
                name="nombre_comercial"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleChangeSQ}
                value={formData.sustancia_id}
              >
                <option value="">Seleccione una sustancia</option>
                {sq.map((sustancia) => (
                  <option key={sustancia.id} value={sustancia.id}>
                    {sustancia.nombre_comercial}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Nombre Químico</Label>
              <Input
                name="nombre_quimico"
                placeholder="Nombre Químico"
                onChange={handleChange}
                value={formData.nombre_quimico}
              />
            </div>
            <div>
              <Label>Número CAS</Label>
              <Input
                name="numero_CAS"
                placeholder="Número CAS"
                onChange={handleChange}
                value={formData.numero_CAS}
              />
            </div>
            <div>
              <Label>Proceso</Label>
              <Input
                name="proceso"
                placeholder="Proceso"
                onChange={handleChange}
                value={formData.proceso}
              />
            </div>
            <Button onClick={nextStep} className="btn-primary w-full mt-3">
              Siguiente
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label>Fabricante</Label>
              <Input
                name="fabricante"
                placeholder="Fabricante"
                onChange={handleChange}
                value={formData.fabricante}
                autocomplete="off"
              />
            </div>
            <div>
              <Label>Datos del Fabricante</Label>
              <TextArea
                name="datos_fabricante"
                placeholder="Datos del Fabricante"
                onChange={(value) => handleTextArea("datos_fabricante", value)}
                value={formData.datos_fabricante}
                rows={5}
              />
            </div>
            <div>
              <Label>Estado Físico</Label>
              <select
                name="estado_fisico"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.estado_fisico}
              >
                <option value="">Seleccione el estado</option>
                <option value="Sólido">Sólido</option>
                <option value="Líquido">Líquido</option>
                <option value="Gas">Gas</option>
              </select>
            </div>
            <div>
              <Label>Presentación</Label>
              <Input
                name="presentacion"
                placeholder="Presentación de la sustancia"
                onChange={handleChange}
                value={formData.presentacion}
              />
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} className="btn-secondary">
                Anterior
              </Button>
              <Button onClick={nextStep} className="btn-primary">
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label>Cantidad existente</Label>
              <Input
                name="cantidad_existente"
                placeholder="Cantidad existente"
                onChange={handleChange}
                value={formData.cantidad_existente}
              />
            </div>
            <div>
              <Label>Sustancia Controlada</Label>
              <select
                name="sustancia_controlada"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.sustancia_controlada}
              >
                <option value="">Seleccione el estado</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <Label>Trasvase</Label>
              <select
                name="trasvase"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.trasvase}
              >
                <option value="">Seleccione el estado</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div>
              <Label>Ficha seguridad disponible</Label>
              <select
                name="ficha_seguridad_disponible"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.ficha_seguridad_disponible}
              >
                <option value="">Seleccione el estado</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} className="btn-secondary">
                Anterior
              </Button>
              <Button onClick={nextStep} className="btn-primary">
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <Label>Clase de Riesgo</Label>
              <select
                name="clase_riesgo"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.clase_riesgo}
              >
                <option value="">Seleccione una clase</option>
                <option value="clase_explosiva">Clase 1. Explosivas</option>
                <option value="gases">Clase 2. Gases</option>
                <option value="liquidos_inflamables">
                  Clases 3. Liquidos inflamables
                </option>
                <option value="Solidos inflamables">
                  Clase 4. Solidos inflamables
                </option>
                <option value="Oxidantes">Clase 5. Oxidantes</option>
                <option value="Toxicos y sustancias infecciosas">
                  Clase 6. Toxicos y sustancias infecciosas
                </option>
                <option value="Sustancias radiactivas">
                  Clase 7. Sustancias radiactivas
                </option>
                <option value="Corrosivos">Clase 8. Corrosivos</option>
                <option value="Miscelaneos">Clase 9. Miscelaneos</option>
              </select>
            </div>
            <div>
              <Label>PH</Label>
              <Input
                name="ph"
                placeholder="PH"
                onChange={handleChange}
                value={formData.ph}
                autocomplete="off"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Pictograma
              </label>
              <div className="flex gap-4 overflow-x-auto p-4 mb-[-15px]">
                {pictograma.map((p) => (
                  <div key={p.id} className="flex flex-col items-center">
                    <div
                      className={`relative p-1 ${
                        selectedPictogramas.includes(p.id)
                          ? "border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      <img
                        src={`data:image/png;base64,${p.foto}`}
                        alt="Pictograma"
                        className="w-20 h-20 object-contain"
                      />
                      {selectedPictogramas.includes(p.id) && (
                        <IoCheckmarkCircle className="absolute top-1 right-1 text-blue-500" />
                      )}
                    </div>
                    <button
                      type="button"
                      name="pictograma_id"
                      onClick={() => handleSelectPictograma(p.id)}
                      className="mt-2"
                    >
                      {selectedPictogramas.includes(p.id) ? (
                        <IoCheckmark className="text-green-500 text-2xl" />
                      ) : (
                        <IoAddCircleOutline className="text-gray-500 text-2xl" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label>Indicaciones Peligro</Label>
              <TextArea
                name="indicaciones_peligro"
                placeholder="Indicaciones Peligro"
                onChange={(value) =>
                  handleTextArea("indicaciones_peligro", value)
                }
                value={formData.indicaciones_peligro}
                rows={5}
              />
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} className="btn-secondary">
                Anterior
              </Button>
              <Button onClick={nextStep} className="btn-primary">
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div>
              <Label>Consejo de Prudencia</Label>
              <TextArea
                name="consejos_prudencia"
                placeholder="Consejo de Prudencia"
                onChange={(value) =>
                  handleTextArea("consejos_prudencia", value)
                }
                value={formData.consejos_prudencia}
                rows={7}
              />
            </div>
            <div>
              <Label>Palabra de advertencia</Label>
              <Input
                name="palabra_advertencia"
                placeholder="Palabra de advertencia"
                onChange={handleChange}
                value={formData.palabra_advertencia}
              />
            </div>
            <div>
              <Label>Categoria de Peligro (Toxicidad Aguda)</Label>
              <TextArea
                name="categoria_peligro"
                placeholder="Categoria de Peligro"
                onChange={(value) => handleTextArea("categoria_peligro", value)}
                value={formData.categoria_peligro}
                rows={5}
              />
            </div>
            <div>
              <Label>Toxicidad Aguda</Label>
              <select
                name="toxicidad_aguda"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.toxicidad_aguda}
              >
                <option value="">Seleccione el estado</option>
                <option value="4">Categoria 1</option>
                <option value="3">Categoria 2</option>
                <option value="2">Categoria 3</option>
                <option value="1">Categoria 4 / No peligroso</option>
              </select>
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} className="btn-secondary">
                Anterior
              </Button>
              <Button onClick={nextStep} className="btn-primary">
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div>
              <Label>Frecuencia de uso</Label>
              <select
                name="frecuencia_uso"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.frecuencia_uso}
              >
                <option value="">Seleccione el estado</option>
                <option value="1">Ocasional</option>
                <option value="2">Intermitente</option>
                <option value="3">Frecuente</option>
                <option value="4">Permanente</option>
              </select>
            </div>
            <div>
              <Label>Procedimiento de uso</Label>
              <select
                name="procedimiento_uso"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.procedimiento_uso}
              >
                <option value="">Seleccione el estado</option>
                <option value="1">
                  1. Cerrado permanentemente (poca exposición, sistema cerrado
                  cabina de pintura)
                </option>
                <option value="2">
                  2. Cerrado regularmente (alguna exposición, cabina mal
                  cerrada)
                </option>
                <option value="3">3. Abierto (como pintura con brocha)</option>
                <option value="4">
                  4. Disperso (como pintura con pistola)
                </option>
              </select>
            </div>
            <div>
              <Label>Tipo de ventilación</Label>
              <select
                name="tipo_ventilacion"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.tipo_ventilacion}
              >
                <option value="">Seleccione el estado</option>
                <option value="1">1. Cabina de extracción</option>
                <option value="2">2. Extracción localizada</option>
                <option value="3">3. Ventilación mecanica general</option>
                <option value="4">4. Solo ventilación natural favorable</option>
                <option value="5">5. Ventilación natural desfavorable</option>
                <option value="6">6. Sin ventilación</option>
              </select>
            </div>
            <div>
              <Label>Superficie cuerpo</Label>
              <select
                name="superficie_cuerpo"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.superficie_cuerpo}
              >
                <option value="">Seleccione el estado</option>
                <option value="1">
                  1. Exposición con elementos de Protección Personal
                </option>
                <option value="2">2. Una Mano</option>
                <option value="3">3. Dos manos / Una mano + antebrazo</option>
                <option value="4">
                  4. Dos manos + antebrazo / Brazo completo
                </option>
                <option value="5">
                  5. Superficie que comprende los miembros superiores y torso
                  y/o pelvis y/o las piernas
                </option>
              </select>
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} className="btn-secondary">
                Anterior
              </Button>
              <Button onClick={nextStep} className="btn-primary">
                Siguiente
              </Button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <div>
              <Label>Carcinogenicidad</Label>
              <select
                name="carcinogenicidad"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.carcinogenicidad}
              >
                <option value="">Seleccione el estado</option>
                <option value="1">Sin datos</option>
                <option value="2">Clase 2B</option>
                <option value="3">Clase 2A</option>
                <option value="4">Clase 1</option>
              </select>
            </div>
            <div>
              <Label>Límites de exposición</Label>
              <TextArea
                name="limites_exposicion"
                placeholder="Límites de exposición"
                onChange={(value) =>
                  handleTextArea("limites_exposicion", value)
                }
                value={formData.limites_exposicion}
                rows={5}
              />
            </div>
            <div>
              <Label>Elementos de protección personal</Label>
              <TextArea
                name="elementos_proteccion_personal"
                placeholder="Elementos de protección personal"
                onChange={(value) =>
                  handleTextArea("elementos_proteccion_personal", value)
                }
                value={formData.elementos_proteccion_personal}
                rows={5}
              />
            </div>
            <div>
              <Label>Almacenamiento</Label>
              <select
                name="almacenamiento"
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                onChange={handleSelect}
                value={formData.almacenamiento}
              >
                <option value="">Seleccione el estado</option>
                <option value="Si">Si</option>
                <option value="No">No</option>
              </select>
            </div>
            <div className="flex justify-between">
              <Button onClick={prevStep} className="btn-secondary">
                Anterior
              </Button>
              <Button type="submit">Actualizar</Button>
            </div>
          </div>
        )}
      </form>
    </ComponentCard>
  );
};

export default EditInventario;