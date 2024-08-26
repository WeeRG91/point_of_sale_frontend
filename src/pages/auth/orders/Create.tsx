import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Card,
  CardMedia,
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useStore } from "../../../store/rootStore";
import ServerSideAutocomplete from "../../../components/ui/serverSideAutoComplete/ServerSideAutocomplete";
import AddNewItemForm from "./AddNewItemForm";
import ItemList from "./ItemList";

//Define the validation schema using Yup
const validationSchema = yup.object().shape({
  customer: yup
    .object()
    .shape({
      id: yup.string().required("Customer is required"),
      label: yup.string().required("Customer is required"),
    })
    .required("Customer is required"),
});

const OrderCreate = () => {
  const navigate = useNavigate();
  const {
    rootStore: { orderStore, customerStore },
  } = useStore();

  const hookFormObj = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      customer: { id: "", label: "" },
    },
  });
  const [productsErrorMessage, setProductsErrorMessage] = useState<any>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = hookFormObj;

  const onSubmit = async (data: any) => {
    try {
      setProductsErrorMessage(null);
      const resData = await orderStore.create(data);
      if (resData) {
        reset({
          customer: { id: "", label: "" },
        });
        orderStore.setCartItems([]);
        navigate("..");
      }
    } catch (error: any) {
      Object.keys(error?.data).map((e: any) => {
        setError(e, {
          type: "manual", // Use 'manual' for manually triggered errors
          message: error?.data[e],
        });
      });
      setProductsErrorMessage("Please select products");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h4>Create</h4>
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Controller
              name="customer"
              control={control}
              render={({ field }) => (
                <ServerSideAutocomplete
                  label="Select an customer"
                  ajaxCallFn={customerStore.getCustomers}
                  onOptionSelect={(option) => field.onChange(option)}
                  error={errors.customer?.id ?? errors.customer}
                  field={field}
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
      {/* Add new item form */}
      <AddNewItemForm />
      {productsErrorMessage ? (
        <Box sx={{ color: "error.main", my: 2 }}>{productsErrorMessage}</Box>
      ) : (
        ""
      )}
      <ItemList editMode={true} />

      <Button
        sx={{ mt: 2 }}
        type="button"
        variant="contained"
        color="success"
        onClick={() => handleSubmit(onSubmit)()}
      >
        Save
      </Button>
      <Button
        sx={{ mt: 2, ml: 2 }}
        variant="contained"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </Box>
  );
};

export default observer(OrderCreate);
