import ComponentCard from "../../components/common/ComponentCard";
import useChemicalReport from "../../hooks/useReport";

const Report = () => {
  const { generateChemicalReport } = useChemicalReport();

  return (
    <ComponentCard title="Matriz de Compatibilidad">
      <p className="text-base text-gray-500 dark:text-gray-400">
        Genera la matriz de compatibilidad con la información de las sustancias
        y los detalles de sus inventarios.
      </p>
      <div className="space-y-6">
        <button
          onClick={generateChemicalReport}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-800 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.03] lg:inline-flex lg:w-auto"
        >
          Generar Archivo
        </button>
      </div>
    </ComponentCard>
  );
};

export default Report;