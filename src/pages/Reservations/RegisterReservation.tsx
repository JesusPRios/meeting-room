import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import DefaultInputs from "./ContentReservation";

export default function FormElements() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <PageBreadcrumb pageTitle="Registro de reserva" />
      <DefaultInputs />
    </div>
  );
}
