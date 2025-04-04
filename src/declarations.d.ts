declare module "*.svg" {
    import { ReactComponent as ReactComponentType } from "react";
    const ReactComponent: ReactComponentType;
    export { ReactComponent };
  }  