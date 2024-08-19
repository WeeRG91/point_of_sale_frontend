import { createContext, useContext } from "react";
import { AuthStore } from "./authStore";
import { CustomerStore } from "./customerStore";
import { DialogStore } from "./dialogStore";

if (process.env.NODE_ENV === "development") {
  const { enableLogging } = require("mobx-logger");
  enableLogging();
}

export interface IRootStore {
  authStore: AuthStore;
  customerStore: CustomerStore;
  dialogStore: DialogStore;
  handleError: Function;
}

export class RootStore implements IRootStore {
  authStore: AuthStore;
  customerStore: CustomerStore;
  dialogStore: DialogStore;

  constructor() {
    console.log("Root Store");
    this.authStore = new AuthStore(this);
    this.customerStore = new CustomerStore(this);
    this.dialogStore = new DialogStore(this);
  }

  public handleError = (
    errorCode: number | null = null,
    errorMessage: string,
    errorData: any
  ) => {
    console.log("handleError: ", errorData);

    if (errorCode === 403) {
      this.authStore.setIsAuthenticated(false);
      return null;
    }
  };
}

const rootStoreContext = createContext({
  rootStore: new RootStore(),
});

export const useStore = () => useContext(rootStoreContext);
