import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import Input from "../components/form/input/InputField";
import { useSoporte } from "../hooks/useSoporte";

export default function SoporteTecnico() {
  const {
    users,
    admin,
    form,
    handleChange,
    handleChangeMessage,
    sendEmail,
    faqs,
    openFAQ,
    setOpenFAQ,
  } = useSoporte();

  return (
    <div>
      <PageBreadcrumb pageTitle="Soporte Técnico" />
      <ComponentCard title="Información Soporte Tecnico">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center">
            <p className="text-[15px] text-gray-700 dark:text-gray-300">
              Querido usuario, si presenta algún problema técnico o necesita ayuda con la plataforma, contáctanos en{" "}
              <span className="font-bold">support@ecotrack.com</span>, también puede llámarnos
              al <span className="font-bold">+57 3053057570 </span>
              de lunes a sábado, de 9:00 a.m. a 6:00 p.m.
            </p>
          </div>

          <ComponentCard title="Preguntas Frecuentes">
            <ul className="space-y-2">
              {faqs.map((faq, index) => (
                <li
                  key={index}
                  className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm "
                >
                  <button
                    className="w-full text-left text-xs font-medium text-gray-800 dark:text-gray-200 flex justify-between items-center"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    {faq.question}
                    <span className="text-gray-500 dark:text-gray-400 text-base">
                      {openFAQ === index ? "-" : "+"}
                    </span>
                  </button>
                  {openFAQ === index && (
                    <p className="mt-1 text-gray-600 dark:text-gray-400 text-xs">
                      {faq.answer}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </ComponentCard>

          <ComponentCard title="Envio de Correo">
            <form
              onSubmit={(e) =>
                sendEmail(
                  e,
                  users?.name || admin?.name || "",
                  users?.email || admin?.email || "",
                  form.mensaje
                )
              }
              className="space-y-4"
            >
              <div className="space-y-3">
                <Input
                  type="text"
                  name="nombre"
                  value={users?.name || admin?.name || ""}
                  placeholder="Ingrese su nombre"
                  onChange={handleChange}
                  autocomplete="off"
                  readOnly
                  className="text-xs"
                />
                <Input
                  type="email"
                  name="email"
                  value={users?.email || admin?.email || ""}
                  placeholder="Ingrese su correo"
                  onChange={handleChange}
                  autocomplete="off"
                  readOnly
                  className="text-xs"
                />
                <textarea
                  name="mensaje"
                  placeholder="Ingrese su mensaje"
                  value={form.mensaje}
                  className="h-48 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                  onChange={handleChangeMessage}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-gradient-to-r from-blue-500 to-blue-700 px-3 py-2 text-white text-sm font-semibold hover:opacity-90 transition duration-300 shadow-md"
              >
                Enviar
              </button>
            </form>
          </ComponentCard>
        </div>
      </ComponentCard>
    </div>
  );
}
