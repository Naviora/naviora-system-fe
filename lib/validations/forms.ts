import { z } from "zod";
import {
  emailSchema,
  phoneSchema,
  nonEmptyStringSchema,
  longTextSchema,
  requiredSelectSchema,
  urlSchema,
} from "./common";

// Contact form schema
export const contactFormSchema = z.object({
  name: nonEmptyStringSchema.max(100, "Name is too long"),
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: requiredSelectSchema,
  message: longTextSchema.min(10, "Message is too short"),
  attachments: z
    .array(z.instanceof(File))
    .max(3, "Maximum 3 files allowed")
    .optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Project creation form
export const projectFormSchema = z.object({
  name: nonEmptyStringSchema.max(100, "Project name is too long"),
  description: longTextSchema.min(20, "Description is too short"),
  category: requiredSelectSchema,
  tags: z
    .array(z.string())
    .min(1, "At least one tag is required")
    .max(5, "Maximum 5 tags allowed"),
  budget: z
    .object({
      min: z.number().min(0, "Minimum budget must be positive"),
      max: z.number().min(0, "Maximum budget must be positive"),
      currency: z.enum(["USD", "EUR", "GBP"]).default("USD"),
    })
    .refine((data) => data.max >= data.min, {
      message: "Maximum budget must be greater than or equal to minimum budget",
      path: ["max"],
    }),
  timeline: z
    .object({
      startDate: z.date().refine((date) => date >= new Date(), {
        message: "Start date must be in the future",
      }),
      endDate: z.date(),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: "End date must be after start date",
      path: ["endDate"],
    }),
  requirements: z
    .array(z.string().min(1))
    .min(1, "At least one requirement is needed"),
  isPublic: z.boolean().default(true),
  website: urlSchema.optional(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

// Settings form schema
export const settingsFormSchema = z.object({
  general: z.object({
    siteName: nonEmptyStringSchema.max(100),
    siteDescription: z.string().max(200).optional(),
    timezone: requiredSelectSchema,
    language: requiredSelectSchema,
  }),
  notifications: z.object({
    emailNotifications: z.boolean(),
    pushNotifications: z.boolean(),
    smsNotifications: z.boolean(),
    marketingEmails: z.boolean(),
  }),
  privacy: z.object({
    profileVisibility: z.enum(["public", "private", "friends"]),
    showEmail: z.boolean(),
    showPhone: z.boolean(),
    allowSearchEngineIndexing: z.boolean(),
  }),
  security: z.object({
    twoFactorAuth: z.boolean(),
    sessionTimeout: z.number().min(15).max(1440), // 15 minutes to 24 hours
    ipRestriction: z.boolean(),
    allowedIPs: z
      .array(
        z
          .string()
          .regex(/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/, "Invalid IP address format")
      )
      .optional(),
  }),
});

export type SettingsFormData = z.infer<typeof settingsFormSchema>;

// File upload schema
export const fileUploadSchema = z.object({
  files: z.array(z.instanceof(File)).min(1, "At least one file is required"),
  folder: z.string().optional(),
  makePublic: z.boolean().default(false),
  description: z.string().max(200).optional(),
});

export type FileUploadFormData = z.infer<typeof fileUploadSchema>;

// Newsletter subscription
export const newsletterSchema = z.object({
  email: emailSchema,
  categories: z.array(z.string()).min(1, "Select at least one category"),
  frequency: z.enum(["daily", "weekly", "monthly"]),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;
