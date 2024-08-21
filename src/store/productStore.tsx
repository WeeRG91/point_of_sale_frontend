import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import React from "react";

export class ProductStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/products";

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
    { field: "name", headerName: "Product Name", width: 150 },
    { field: "category_id", headerName: "Category", width: 150 },
    { field: "price", headerName: "Price", width: 200 },
    { field: "stock", headerName: "Stock", width: 200 },
  ];

  constructor(rootStore: IRootStore) {
    makeObservable(this, {
      rowData: observable,
      columns: observable,
      setRowData: action,
      fetchList: action,
      getProduct: action,
      create: action,
      update: action,
      getCategories: action,
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
        this.setRowData(data.data.products);
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  getCategories = async () => {
    try {
      const response = await fetch(this.BASE_URL + "/categories", {
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
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  getProduct = async (id: number | string) => {
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
        },
        body: postData,
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        this.rootStore.alertStore.open({ status: "success", message: data.message });
        return Promise.resolve(data);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  update = async (id: number | string, postData: any) => {
    try {
      const response = await fetch(this.BASE_URL + `/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
        },
        body: postData,
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        this.rootStore.alertStore.open({ status: "success", message: data.message });
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
        this.rootStore.alertStore.open({ status: "success", message: data.message });
        return Promise.resolve(data);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  deleteDialog = async (params: any) => {
    this.rootStore.dialogStore.openDialog({
      confirmFn: () => this.delete(params.row.id),
      dialogText: "Are you sure you want to delete this product ?",
    });
  };
}
