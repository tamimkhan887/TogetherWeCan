import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    photoUrl: z
      .string()
      .min(1, "Photo URL is required")
      .url("Please enter a valid image URL"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const eventFormSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description is too long"),
  category: z.enum(
    [
      "Cleanup",
      "Plantation",
      "Donation",
      "Education",
      "Healthcare",
      "Community Support",
      "Other",
    ],
    {
      message: "Please select a valid category",
    }
  ),
  image: z
    .string()
    .min(1, "Thumbnail image URL is required")
    .url("Please enter a valid image URL"),
  location: z.string().min(3, "Location is required (at least 3 characters)"),
  date: z
    .string()
    .min(1, "Event date is required")
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return !isNaN(selected.getTime()) && selected >= today;
    }, "Event date must be today or in the future"),
  maxCapacity: z.number().min(1, "Capacity must be at least 1").optional(),
});

export type EventFormData = z.infer<typeof eventFormSchema>;

export const profileSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  avatar: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bio: z.string().max(250, "Bio cannot exceed 250 characters").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
