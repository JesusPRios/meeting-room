import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import usePictograma from "../../hooks/usePictograma";
import { IoTrash } from "react-icons/io5";

const ListPictogramas = () => {
  const { pictogramas, deletePictograma } = usePictograma();

  return (
    <>
      <PageBreadcrumb pageTitle="Listado de Pictogramas" />
      <div className="max-w-6xl mx-auto py-2">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-4">
          {pictogramas.length > 0 ? (
            pictogramas.map((pictograma) => (
              <div
                key={pictograma.id}
                className="relative bg-white dark:bg-gray-900 rounded-lg p-3 flex flex-col items-center border border-gray-200 dark:border-gray-700"
              >
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => deletePictograma(pictograma.id)}
                    className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600"
                  >
                    <IoTrash size={18} />
                  </button>
                </div>
                <img
                  src={`data:image/png;base64,${pictograma.foto}`}
                  alt={pictograma.name}
                  className="w-20 h-20 object-contain rounded-md mb-2"
                />
                <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full">
                  {pictograma.name}
                </h2>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
              No hay pictogramas disponibles.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ListPictogramas;
