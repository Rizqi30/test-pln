import * as yup from "yup";

export const addUserValidationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: yup.string().required("Password is required"),
});

export const updateUserValidationSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Email must be a valid email address"),
  password: yup.string(),
});

export const projectValidationSchema = yup.object({
  name: yup.string().required("Name is required"),
  location: yup.string().required("Location is required"),
});

export const detailValidationSchema = yup.object({
  project_id: yup.string().required("Project ID is required"),
  work_date: yup.date(),
  hours_worked: yup
    .number()
    .required("Hours worked is required")
    .min(0)
    .max(8, "Hours worked must not exceed 8")
    .typeError("Hours worked must be a number"),
});

export const loginValidationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});
