import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, Grid, TextField } from "@mui/material";
import { observer } from "mobx-react-lite";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useStore } from "../../../store/rootStore";

// Define the validation schema using Yup
const validationSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  phone_number: yup
    .string()
    .required("Phone number is required")
    .min(10, "Phone number must be 10 charecter")
    .max(10, "Phone number must be 10 charecter"),
  zip_code: yup
    .string()
    .required("Zipcode is required")
    .min(6, "Zipcode must be 6 charecter")
    .max(6, "Zipcode must be 6 charecter"),
});

const CustomerCreate = () => {
  const navigate = useNavigate();
  const {
    rootStore: { customerStore },
  } = useStore();
  const { create } = customerStore;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      zip_code: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
        const resData = await create(data);

        if(resData) {
            reset();
            navigate('..')
        }
    } catch (error: any) {
      console.log(error);
      Object.keys(error?.data).map((e: any) => {
        setError(e, {
            type: 'manual',
            message: error?.data[e],
        })
      })
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h4>Create</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Controller
              name="first_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="first_name"
                  label="First name"
                  variant="filled"
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="last_name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="last_name"
                  label="Last name"
                  variant="filled"
                  error={!!errors.last_name}
                  helperText={errors.last_name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="email"
                  label="Email"
                  variant="filled"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="phone_number"
                  label="Phone number"
                  variant="filled"
                  error={!!errors.phone_number}
                  helperText={errors.phone_number?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="zip_code"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="zip_code"
                  label="Zip code"
                  variant="filled"
                  error={!!errors.zip_code}
                  helperText={errors.zip_code?.message}
                />
              )}
            />
          </Grid>
        </Grid>
        <Button
          sx={{ mt: 2 }}
          type="submit"
          variant="contained"
          color="success"
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
      </form>
    </Box>
  );
};

export default observer(CustomerCreate);
