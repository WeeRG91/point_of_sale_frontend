import { observable, action, makeObservable } from "mobx";
import { IRootStore } from "./rootStore";
import { AlertColor } from "@mui/material";

interface AlertData {
    status: AlertColor,
    message: string,
    data?: any,
}

export class AlertStore {
  isAlertOpen = false;
  alertData: AlertData | null = {
    status: "error",
    message: "This is an error",
    data: [],
  };
  private rootStore: IRootStore;

  constructor(rootStore: IRootStore) {
    console.log("DialogStore");
    makeObservable(this, {
      isAlertOpen: observable,
      alertData: observable,
      open: action,
      close: action,
    });
    // Access all the store via root store
    this.rootStore = rootStore;
  }

  open = (data: any) => {
    this.alertData = data;
    this.isAlertOpen = true;
  };

  close = () => {
    this.alertData = null;
    this.isAlertOpen = false;
  };
}
