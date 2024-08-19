import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

export class CustomerStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/customers";

  rootStore: IRootStore;
  rowData: GridRowsProp[] = [];
  columns: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div style={{ display: "flex" }}>
          <ListItemButton
            sx={{ width: 0 }}
            component={Link}
            to={"edit/" + params.row.id}
          >
            <EditIcon />
          </ListItemButton>
          <ListItemButton onClick={() => this.deleteDialog(params)}>
            <DeleteIcon />
          </ListItemButton>
        </div>
      ),
    },
    { field: "id", headerName: "Id", width: 100 },
    { field: "first_name", headerName: "First Name", width: 150 },
    { field: "last_name", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone_number", headerName: "Phone Number", width: 200 },
    { field: "zip_code", headerName: "Zip Code", width: 150 },
  ];

  constructor(rootStore: IRootStore) {
    makeObservable(this, {
      rowData: observable,
      columns: observable,
      setRowData: action,
      fetchList: action,
      getCustomer: action,
      create: action,
      update: action,
    });
    this.rootStore = rootStore;
  }

  setRowData(values: GridRowsProp[]) {
    this.rowData = values;
  }

  fetchList = async () => {
    try {
      const response = await fetch(this.BASE_URL + "/list", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(
          response.status,
          `HTTP Request failed: ${response.status} ${response.statusText}`,
          data
        );
        return Promise.reject(data);
      } else {
        this.setRowData(data.data.customers);
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  getCustomer = async (id: number | string) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  create = async (postData: any) => {
    try {
      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  update = async (id: number | string, postData: any) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        return Promise.resolve(data);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  delete = async (id: number) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        this.setRowData(this.rowData.filter((row: any) => row.id !== id));
        return Promise.resolve(data);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  deleteDialog = async (params: any) => {
    this.rootStore.dialogStore.openDialog({
      confirmFn: () => this.delete(params.row.id),
      dialogText: "Are you sure you want to delete this customer ?",
    });
  };
}
