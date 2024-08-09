import { createContext, useContext } from "react";
import { AuthStore } from "./authStore";

export interface IRootStore {
  authStore: AuthStore;
  handleError: Function;
}

export class RootStore implements IRootStore {
  authStore: AuthStore;

  constructor() {
    console.log("Root Store");
    this.authStore = new AuthStore(this);
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
