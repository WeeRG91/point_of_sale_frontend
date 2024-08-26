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
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useStore } from "../../../store/rootStore";

// Define the validation schema using Yup
const validationSchema = yup.object().shape({
  name: yup.string().required("Product name is required"),
  category_id: yup.string().required("Category is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Minimum price is 0"),
  stock: yup
    .number()
    .required("Stock is required")
    .min(0, "Minimum stock is 0"),
  image: yup
    .mixed()
    .test("fileType", "Unsupported file format", (value: any) => {
      if (value !== "") {
        const supportedFormat = ["image/jpeg", "image/png", "image/jpg"];
        return supportedFormat.includes(value.type);
      }
      return true; // skip this
    })
    .test("fileSize", "File size is too large (max:5000KB)", (value: any) => {
      if (value !== "") {
        return value.size <= 5000000; //5000KB in bytes
      }
      return true; // skip this
    }),
});

const ProductCreate = () => {
  const navigate = useNavigate();
  const {
    rootStore: { productStore },
  } = useStore();
  const { update, getCategories, getProduct } = productStore;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const { id } = useParams();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      category_id: "",
      price: 0,
      stock: 0,
      image: "",
    },
  });

  const initForm = async () => {
    try {
      const response = await getCategories();
      setCategories(response.data.categories);

      if (id) {
        const resData = await getProduct(id);
        console.log(resData.data.product)
        let { image, category, ...formData } = resData.data.product;
        setImageUrl(process.env.REACT_APP_STOREGE_URL + "/" + image);
        console.log(formData);
        reset(formData);
      } else {
        navigate(-1);
      }
    } catch (error) {
      console.log("Error while fetching a customer: ", error);
    }
  };

  useEffect(() => {
    initForm();
  }, [id]);

  const onSubmit = async (data: any) => {
    try {
      if (id) {
        const formData = new FormData();
        Object.keys(data).map((key) => {
          if (key === "image") {
            if (data[key] !== "") {
              formData.append(key, data[key]);
            }
          } else {
            formData.append(key, data[key]);
          }
        });

        const resData = await update(id, formData);
        if (resData) {
          reset();
          navigate("..");
        }
      }
    } catch (error: any) {
      console.log(error);
      Object.keys(error?.data).map((e: any) => {
        setError(e, {
          type: "manual",
          message: error?.data[e],
        });
      });
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      <h4>Edit</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="name"
                  label="Product Name"
                  variant="filled"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  select
                  id="category_id"
                  label="Category"
                  variant="filled"
                  error={!!errors.category_id}
                  helperText={errors.category_id?.message}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="price"
                  label="Price"
                  variant="filled"
                  error={!!errors.price}
                  helperText={errors.price?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="stock"
                  label="Stock"
                  variant="filled"
                  error={!!errors.stock}
                  helperText={errors.stock?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={6}>
            {imageUrl && (
              <Card sx={{ maxWidth: 345, my: 5 }}>
                <CardMedia
                  component="img"
                  alt="product-image"
                  height="auto"
                  image={imageUrl ?? ""}
                />
              </Card>
            )}
            <Controller
              name="image"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  id="image"
                  type="file"
                  label="Image"
                  focused
                  variant="filled"
                  onChange={(e: any) => {
                    field.onChange(e.target.files[0]);
                    e.target.files.length > 0
                      ? setImageUrl(URL.createObjectURL(e.target.files[0]))
                      : setImageUrl(null);
                  }}
                  error={!!errors.image}
                  helperText={errors.image?.message}
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

export default observer(ProductCreate);
