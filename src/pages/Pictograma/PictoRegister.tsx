import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import usePictograma from "../../hooks/usePictograma";
import { FaUpload, FaImage } from "react-icons/fa";

const PictoRegister = () => {
  const { handleImagePreview, handleNombreChange, previewImage, handleSubmit } =
    usePictograma();

  return (
    <>
      <PageBreadcrumb pageTitle="Registrar Pictograma" />
      <form
        className="w-full max-w-5xl mx-auto p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-3 gap-6 items-center w-full">
          <div className="flex flex-col items-center gap-2 p-3 rounded-lg">
            <div className="w-40 h-40 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Vista previa"
                  className="h-full w-full object-contain"
                />
              ) : (
                <FaImage className="text-gray-400 w-12 h-12" />
              )}
            </div>
          </div>

          <div className="col-span-2 flex flex-col gap-4 mt-4 ml-[-40px] mr-16">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre del Pictograma
              </label>
              <input
                type="text"
                name="nombre"
                autoComplete="off"
                placeholder="Ingrese el nombre"
                className="w-full p-3 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition"
                required
                onChange={handleNombreChange}
              />
            </div>
            <div className="flex gap-4">
              <input
                type="file"
                id="fileInput"
                name="foto"
                className="hidden"
                accept="image/*"
                onChange={handleImagePreview}
                required
              />
              <label
                htmlFor="fileInput"
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-brand-500 rounded-md cursor-pointer hover:bg-brand-600 transition"
              >
                <FaUpload className="w-4 h-4" /> Subir Imagen
              </label>
              <button
                type="submit"
                className="px-8 py-3 rounded-md bg-brand-500 text-white text-sm font-medium shadow-sm hover:bg-brand-600 transition focus:outline-none focus:ring-2 focus:ring-brand-600"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default PictoRegister;
