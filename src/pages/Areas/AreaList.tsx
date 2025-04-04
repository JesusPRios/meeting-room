import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import useDataArea from "../../hooks/useArea";
import {
  IoPencil,
  IoTrash,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

const AreaList = () => {
  const {
    paginatedAreas,
    deleteArea,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    handleEdit
  } = useDataArea();

  return (
    <>
      <PageBreadcrumb pageTitle="Listado de Áreas" />
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                >
                  Nombre del área
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                >
                  Usuario encargado
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-gray-500 text-start text-theme-sm dark:text-white"
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05] text-sm">
              {paginatedAreas.length > 0 ? (
                paginatedAreas.map((area) => (
                  <TableRow key={area.id}>
                    <TableCell className="sm:px-6 text-start text-gray-900 dark:text-white/90">
                      {area.name}
                    </TableCell>
                    <TableCell className="sm:px-6 text-start text-gray-900 dark:text-white/90">
                      {area.nombre_usuario}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start sm:px-5">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg dark:bg-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition border dark:border-gray-700 dark:hover:border-gray-600"
                        onClick={() => handleEdit(area.id)}
                        >
                          <IoPencil size={18} />
                        </button>
                        <button
                          onClick={() => deleteArea(area.id)}
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
                  <TableCell className="text-start py-4 px-5 text-gray-500 dark:text-white">
                    No hay áreas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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
};

export default AreaList;
