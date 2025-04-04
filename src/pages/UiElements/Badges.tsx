import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Badge from "../../components/ui/badge/Badge";
// import { img src={PlusIcon} } from "../../icons";
import PlusIcon from "../../icons/plus.svg"

export default function Badges() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Badges" />
      <div className="space-y-5 sm:space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              With Light Background
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              {/* Light Variant */}
              <Badge variant="light" color="primary">
                Primary
              </Badge>
              <Badge variant="light" color="success">
                Success
              </Badge>{" "}
              <Badge variant="light" color="error">
                Error
              </Badge>{" "}
              <Badge variant="light" color="warning">
                Warning
              </Badge>{" "}
              <Badge variant="light" color="info">
                Info
              </Badge>
              <Badge variant="light" color="light">
                Light
              </Badge>
              <Badge variant="light" color="dark">
                Dark
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              With Solid Background
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              {/* Light Variant */}
              <Badge variant="solid" color="primary">
                Primary
              </Badge>
              <Badge variant="solid" color="success">
                Success
              </Badge>{" "}
              <Badge variant="solid" color="error">
                Error
              </Badge>{" "}
              <Badge variant="solid" color="warning">
                Warning
              </Badge>{" "}
              <Badge variant="solid" color="info">
                Info
              </Badge>
              <Badge variant="solid" color="light">
                Light
              </Badge>
              <Badge variant="solid" color="dark">
                Dark
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Light Background with Left Icon
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="light" color="primary" startIcon={<img src={PlusIcon} />}>
                Primary
              </Badge>
              <Badge variant="light" color="success" startIcon={<img src={PlusIcon} />}>
                Success
              </Badge>{" "}
              <Badge variant="light" color="error" startIcon={<img src={PlusIcon} />}>
                Error
              </Badge>{" "}
              <Badge variant="light" color="warning" startIcon={<img src={PlusIcon} />}>
                Warning
              </Badge>{" "}
              <Badge variant="light" color="info" startIcon={<img src={PlusIcon} />}>
                Info
              </Badge>
              <Badge variant="light" color="light" startIcon={<img src={PlusIcon} />}>
                Light
              </Badge>
              <Badge variant="light" color="dark" startIcon={<img src={PlusIcon} />}>
                Dark
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Solid Background with Left Icon
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="solid" color="primary" startIcon={<img src={PlusIcon} />}>
                Primary
              </Badge>
              <Badge variant="solid" color="success" startIcon={<img src={PlusIcon} />}>
                Success
              </Badge>{" "}
              <Badge variant="solid" color="error" startIcon={<img src={PlusIcon} />}>
                Error
              </Badge>{" "}
              <Badge variant="solid" color="warning" startIcon={<img src={PlusIcon} />}>
                Warning
              </Badge>{" "}
              <Badge variant="solid" color="info" startIcon={<img src={PlusIcon} />}>
                Info
              </Badge>
              <Badge variant="solid" color="light" startIcon={<img src={PlusIcon} />}>
                Light
              </Badge>
              <Badge variant="solid" color="dark" startIcon={<img src={PlusIcon} />}>
                Dark
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Light Background with Right Icon
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="light" color="primary" endIcon={<img src={PlusIcon} />}>
                Primary
              </Badge>
              <Badge variant="light" color="success" endIcon={<img src={PlusIcon} />}>
                Success
              </Badge>{" "}
              <Badge variant="light" color="error" endIcon={<img src={PlusIcon} />}>
                Error
              </Badge>{" "}
              <Badge variant="light" color="warning" endIcon={<img src={PlusIcon} />}>
                Warning
              </Badge>{" "}
              <Badge variant="light" color="info" endIcon={<img src={PlusIcon} />}>
                Info
              </Badge>
              <Badge variant="light" color="light" endIcon={<img src={PlusIcon} />}>
                Light
              </Badge>
              <Badge variant="light" color="dark" endIcon={<img src={PlusIcon} />}>
                Dark
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-5">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              Solid Background with Right Icon
            </h3>
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-800 xl:p-10">
            <div className="flex flex-wrap gap-4 sm:items-center sm:justify-center">
              <Badge variant="solid" color="primary" endIcon={<img src={PlusIcon} />}>
                Primary
              </Badge>
              <Badge variant="solid" color="success" endIcon={<img src={PlusIcon} />}>
                Success
              </Badge>{" "}
              <Badge variant="solid" color="error" endIcon={<img src={PlusIcon} />}>
                Error
              </Badge>{" "}
              <Badge variant="solid" color="warning" endIcon={<img src={PlusIcon} />}>
                Warning
              </Badge>{" "}
              <Badge variant="solid" color="info" endIcon={<img src={PlusIcon} />}>
                Info
              </Badge>
              <Badge variant="solid" color="light" endIcon={<img src={PlusIcon} />}>
                Light
              </Badge>
              <Badge variant="solid" color="dark" endIcon={<img src={PlusIcon} />}>
                Dark
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
