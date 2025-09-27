import { z } from "zod";

// Common validation patterns
export const emailSchema = z.string().email("Invalid email address");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one lowercase letter, one uppercase letter, and one number"
  );

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format");

export const urlSchema = z.string().url("Invalid URL format");

// Utility schemas
export const nonEmptyStringSchema = z.string().min(1, "This field is required");
export const positiveNumberSchema = z
  .number()
  .positive("Must be a positive number");
export const optionalStringSchema = z.string().optional();

// Date schemas
export const futureDateSchema = z
  .date()
  .refine((date) => date > new Date(), {
    message: "Date must be in the future",
  });

export const pastDateSchema = z
  .date()
  .refine((date) => date < new Date(), { message: "Date must be in the past" });

// ID schemas
export const uuidSchema = z.string().uuid("Invalid UUID format");
export const numericIdSchema = z.number().int().positive();

// File validation
export const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5000000, "File size should be less than 5MB")
  .refine(
    (file) =>
      ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type
      ),
    "Only JPEG, PNG and WebP files are supported"
  );

// Common form field patterns
export const requiredSelectSchema = z
  .string()
  .min(1, "Please select an option");
export const optionalSelectSchema = z.string().optional();

// Text content schemas
export const shortTextSchema = z
  .string()
  .max(100, "Text is too long (max 100 characters)");
export const mediumTextSchema = z
  .string()
  .max(500, "Text is too long (max 500 characters)");
export const longTextSchema = z
  .string()
  .max(2000, "Text is too long (max 2000 characters)");

// Arrays
export const nonEmptyArraySchema = <T>(itemSchema: z.ZodType<T>) =>
  z.array(itemSchema).min(1, "At least one item is required");

export const optionalArraySchema = <T>(itemSchema: z.ZodType<T>) =>
  z.array(itemSchema).optional();

// Generic pagination schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type PaginationParams = z.infer<typeof paginationSchema>;

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, "Search query is required"),
  filters: z.record(z.string(), z.string()).optional(),
});
