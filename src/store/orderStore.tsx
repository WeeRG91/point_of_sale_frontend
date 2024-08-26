import React from "react";
import { action, makeObservable, observable } from "mobx";
import { IRootStore } from "./rootStore";
import { GridColDef, GridRowsProp } from "@mui/x-data-grid";
import { ListItemButton } from "@mui/material";
import { Link } from "react-router-dom";
import { LocalPrintshop } from "@mui/icons-material";

export class OrderStore {
  BASE_URL = process.env.REACT_APP_API_URL + "/orders";

  cartItems: any[] = [];
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
            to={"view/" + params.row.id}
          >
            <LocalPrintshop />
          </ListItemButton>
        </div>
      ),
    },
    { field: "id", headerName: "Id", width: 100 },
    { field: "order_number", headerName: "Order Number", width: 150 },
    { field: "customer_name", headerName: "Customer Name", width: 150 },
    { field: "quantity", headerName: "Quantity", width: 200 },
    { field: "price", headerName: "Price", width: 200 },
  ];

  constructor(rootStore: IRootStore) {
    makeObservable(this, {
      rowData: observable,
      columns: observable,
      cartItems: observable,
      setRowData: action,
      setCartItems: action,
      addToCart: action,
      removeFromCart: action,
      fetchList: action,
      getOrder: action,
      create: action,
    });
    this.rootStore = rootStore;
  }

  setRowData(values: GridRowsProp[]) {
    this.rowData = values;
  }

  setCartItems = (items: any[]) => {
    this.cartItems = items;
  };

  addToCart = async (value: any): Promise<boolean> => {
    this.cartItems.push(value);
    return Promise.resolve(true);
  };

  removeFromCart = async (index: any) => {
    this.cartItems.splice(index, 1);
  };

  calculateFinalPrice = (
    original: number,
    discount: number,
    quantity: number
  ): number => {
    const finalPrice = original - (original * discount) / 100;
    return finalPrice * quantity;
  };

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
        this.setRowData(data.data.orders);
        return Promise.resolve(data);
      }
    } catch (error: any) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  getOrder = async (id: number | string) => {
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
        const orderItems = data.data.order?.items.map((item: any) => {
          return {
            product: {
              label: item.product_name,
            },
            quantity: item.product_quantity,
            price: item.product_price,
            discount: item.product_discount,
            total: this.calculateFinalPrice(
              item.product_price,
              item.product_discount,
              item.product_quantity
            ),
          };
        });
        this.setCartItems(orderItems);
        return Promise.resolve(data.data.order);
      }
    } catch (error) {
      this.rootStore.handleError(419, "Something went wrong!", error);
    }
  };

  create = async (customerData: any) => {
    try {
      const postDataProducts = [...this.cartItems].map((item: any) => {
        return {
          product_id: item.product.id,
          quantity: item.quantity,
          discount: item.discount,
        };
      });
      console.log("Order create", postDataProducts);

      const formData = new FormData();
      formData.append("customer_id", customerData.customer?.id);
      postDataProducts.forEach((item: any, index: number) => {
        Object.keys(item).map((key: any) => {
          formData.append(`products[${index}][${key}]`, item[key]);
        });
      });

      const response = await fetch(this.BASE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.rootStore.authStore.token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        this.rootStore.handleError(response.status, data.message, data);
        return Promise.reject(data);
      } else {
        this.rootStore.alertStore.open({
          status: "success",
          message: data.message,
        });
        return Promise.resolve(data);
      }
    } catch (error) {
      this.rootStore.handleError(
        419,
        "Create order - Something went wrong!",
        error
      );
    }
  };
}
