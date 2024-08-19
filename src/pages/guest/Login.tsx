import React from "react";
import { Button, Card, CardContent, TextField } from "@mui/material";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useStore } from "../../store/rootStore";
import { Navigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

//Define Yup schema for validation
const schema = yup.object().shape({
  email: yup
    .string()
    .required("This is required.")
    .email("This is a invalid email."),
  password: yup
    .string()
    .required("This is required.")
    .min(4, "This field should be at least 4 characters."),
});

function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const {
    rootStore: { authStore },
  } = useStore();

  const isAuthenticated = authStore.isAuthenticated;
  if (isAuthenticated) {
    return <Navigate to="/dashboard/customers" />;
  }

  const onSubmit = async (data: any) => {
    console.log(data);

    try {
      const res = authStore.login(data);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card sx={{ minWidth: 450, justifyContent: "center" }}>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <h1>Login</h1>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="email"
                  type="email"
                  label="Email"
                  variant="filled"
                  error={!!errors.email}
                  helperText={errors.email ? errors.email.message : ""}
                  {...field}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="password"
                  type="password"
                  label="Password"
                  variant="filled"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                  {...field}
                />
              )}
            />

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={isSubmitting}
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default observer(Login);
