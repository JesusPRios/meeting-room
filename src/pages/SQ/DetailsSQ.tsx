/* eslint-disable react-hooks/exhaustive-deps */
import {
  IoFlask,
  IoDocumentText,
  IoCloudUpload,
  IoEye,
  IoDownload,
  IoTrash,
} from "react-icons/io5";
import useSQData from "../../hooks/useSQData";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Files } from "../../hooks/useFiles";
import ComponentCard from "../../components/common/ComponentCard";

const DetailsSQ = () => {
  const { sq, getSQID, uploadFile, files, fetchFiles, handleDeleteFile } = useSQData();
  const { openFilePreview, downloadFile } = Files();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;

    getSQID(Number(id));
    fetchFiles(Number(id));
  }, [id]);

  if (!sq) return <p className="text-gray-500">Cargando...</p>;

  const paragraphs = sq.descripcion.split("\n").filter(Boolean);

  return (
    <ComponentCard title="Detalles de la sustancia química">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="text-left">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Usuario Responsable
            </p>
            <p className="text-lg font-medium text-gray-700 dark:text-white">
              {sq.usuario_nombre}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Área Asignada
          </p>
          <p className="text-base font-semibold text-gray-800 dark:text-white">
            {sq.area_nombre}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoItem
          icon={IoFlask}
          label="Nombre Comercial"
          value={sq.nombre_comercial}
        />
        <InfoItem
          icon={IoDocumentText}
          label="Descripción"
          value={paragraphs.join("\n")}
          isExpandable
          extraClasses="md:col-span-2"
        />

        <div className="md:col-span-3 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <IoCloudUpload className="text-green-600 dark:text-green-400 w-7 h-7" />
            </div>
            <div className="w-full">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Subir Archivo
              </p>
              <input
                type="file"
                className="w-full text-sm text-gray-700 dark:text-gray-300"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    uploadFile(
                      Number(id),
                      sq.nombre_comercial,
                      sq.area_nombre,
                      e.target.files[0]
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-3 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            Archivos Adjuntos
          </p>
          {files.length > 0 ? (
            files.map((file) => (
              <div
                key={file.id}
                className="flex justify-between items-center p-2 border-b last:border-none"
              >
                <p className="text-sm text-gray-800 dark:text-white truncate">
                  {file.nombre_archivo}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => openFilePreview(file)}
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600"
                  >
                    <IoEye className="w-5 h-5 cursor-pointer text-gray-500" />
                  </button>

                  <button
                    onClick={() => downloadFile(file)}
                    className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600"
                  >
                    <IoDownload
                      className="w-5 h-5 cursor-pointer text-gray-500"
                      title="Descargar"
                    />
                  </button>

                  <button
                    className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600"
                    onClick={() =>
                      handleDeleteFile(
                        file.id,
                        sq.area_nombre,
                        sq.nombre_comercial,
                        file.nombre_archivo
                      )
                    }
                  >
                    <IoTrash
                      title="Eliminar"
                      className="w-5 h-5 cursor-pointer text-gray-500"
                    />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No hay archivos adjuntos</p>
          )}
        </div>
      </div>
    </ComponentCard>
  );
};

const InfoItem = ({
  icon: Icon,
  label = "",
  value = "",
  isExpandable = false,
  isTitle = false,
  descriptionLength = 0,
  extraClasses = "",
}) => {
  const [showFull, setShowFull] = useState(false);
  const maxLength = 180;

  return (
    <div
      className={`flex flex-col gap-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-sm border border-gray-700 ${extraClasses}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
          <Icon className="text-blue-600 dark:text-blue-400 w-7 h-7" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </p>
          <p
            className={`${
              isTitle && descriptionLength > 180 ? "text-md" : "text-lg"
            } text-gray-800 dark:text-white text-sm whitespace-pre-line`}
          >
            {isExpandable && value.length > maxLength
              ? showFull
                ? value
                : `${value.substring(0, maxLength)}...`
              : value}
          </p>

          {isExpandable && value.length > maxLength && (
            <button
              onClick={() => setShowFull(!showFull)}
              className="text-blue-500 text-sm hover:underline mt-1"
            >
              {showFull ? "Ver menos" : "Ver más"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsSQ;