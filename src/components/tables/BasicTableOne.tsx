import { useEffect } from "react";
import useSQData from "../../hooks/useSQData";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import PageBreadcrumb from "../common/PageBreadCrumb";
import {
  IoChevronBack,
  IoChevronForward,
  IoEye,
  IoPencil,
  IoTrash,
} from "react-icons/io5";
import Alert from "../ui/alert/Alert";

export default function TablaSustanciasQuimicas() {
  const {
    getSqData,
    handleDetalles,
    handleDelete,
    success,
    selectedItems,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    handleEdit
  } = useSQData();

  useEffect(() => {
    getSqData();
  }, [getSqData]);

  const areaColor: Record<string, string> = {
    Laboratorio:
      "bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800",
    Pintura: "bg-green-100 text-green-800",
    "Almacén de Reactivos": "bg-yellow-100 text-yellow-800",
    "Planta Piloto": "bg-red-100 text-red-800",
    "Área General": "bg-gray-100 text-gray-800",
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Listado de sustancias químicas" />

      <div className="fixed bottom-10 right-5 z-50">
        {success && (
          <Alert
            variant="success"
            title="Eliminación exitosa"
            message="La sustancia química ha sido eliminada exitosamente."
          />
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                  >
                    Usuario Responsable
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                  >
                    Nombre Comercial
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                  >
                    Área
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                  >
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {selectedItems.length > 0 ? (
                  selectedItems.map((sustancia) => (
                    <TableRow key={sustancia.id}>
                      <TableCell className="px-4 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {sustancia.usuario_nombre}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-800 text-start text-theme-sm dark:text-white/90 sm:px-5">
                        {sustancia.nombre_comercial}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm sm:px-5">
                        <span
                          className={`px-3 py-1 rounded-lg font-medium ${
                            areaColor[sustancia.area_nombre] ||
                            "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {sustancia.area_nombre}
                        </span>
                      </TableCell>

                      <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-white/90 sm:px-5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDetalles(sustancia.id)}
                            className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600"
                          >
                            <IoEye size={18} />
                          </button>

                          <button 
                            onClick={() => handleEdit(sustancia.id)}
                            className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600">
                            <IoPencil size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(sustancia.id)}
                            className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600"
                          >
                            <IoTrash size={18} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell className="text-start py-2 px-6 text-gray-900 dark:text-white">
                      No hay sustancias químicas registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Paginación */}
        <div className="flex justify-center items-center p-4 gap-8 border-t border-gray-200 bg-gray-50 dark:border-white/[0.05] dark:bg-white/[0.03]">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <IoChevronBack />
          </button>

          <span className="text-gray-600">
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            <IoChevronForward />
          </button>
        </div>
      </div>
    </>
  );
}
