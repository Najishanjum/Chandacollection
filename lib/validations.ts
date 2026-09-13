import { z } from "zod";

/* ============================================
   PERSON SCHEMAS
   ============================================ */

export const addPersonSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  phone: z
    .string()
    .min(10, "Mobile number must be 10 digits")
    .max(10, "Mobile number must be 10 digits")
    .regex(/^\d{10}$/, "Enter a valid 10-digit mobile number"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters")
    .trim(),
  area: z.string().max(100, "Area must be less than 100 characters").trim().optional().default(""),
  monthly_amount: z
    .number({ invalid_type_error: "Enter a valid amount" })
    .min(1, "Monthly Chanda must be at least ₹1")
    .max(1000000, "Monthly Chanda must be less than ₹10,00,000"),
  start_month: z.number().min(1).max(12),
  start_year: z.number().min(2020).max(2030),
});

export type AddPersonInput = z.infer<typeof addPersonSchema>;

/* ============================================
   PAYMENT SCHEMAS
   ============================================ */

export const recordPaymentSchema = z.object({
  member_id: z.string().uuid("Select a person"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2030),
  amount: z
    .number({ invalid_type_error: "Enter a valid amount" })
    .min(1, "Amount must be at least ₹1"),
  payment_method: z.enum(["cash", "upi", "bank"], {
    required_error: "Select a payment method",
  }),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

/* ============================================
   CANCEL PAYMENT SCHEMA
   ============================================ */

export const cancelPaymentSchema = z.object({
  payment_id: z.string().uuid(),
  reason: z
    .string()
    .min(3, "Please provide a reason for cancellation")
    .max(500, "Reason must be less than 500 characters")
    .trim(),
});

export type CancelPaymentInput = z.infer<typeof cancelPaymentSchema>;

/* ============================================
   ORGANIZATION SCHEMAS
   ============================================ */

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(3, "Masjid name must be at least 3 characters")
    .max(100, "Masjid name must be less than 100 characters")
    .trim(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters")
    .trim(),
  state: z.string().max(50).trim().optional().default(""),
  address: z.string().max(250).trim().optional().default(""),
  receipt_prefix: z
    .string()
    .min(1, "Receipt prefix is required")
    .max(5, "Receipt prefix must be less than 5 characters")
    .regex(/^[A-Z]+$/, "Receipt prefix must be uppercase letters only")
    .trim(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial().extend({
  footer_message: z.string().max(200).trim().optional(),
  is_public: z.boolean().optional(),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

/* ============================================
   AUTH SCHEMAS
   ============================================ */

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .trim(),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  masjid_name: z
    .string()
    .min(3, "Masjid name must be at least 3 characters")
    .max(100)
    .trim(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50)
    .trim(),
});

export type SignupInput = z.infer<typeof signupSchema>;

/* ============================================
   CONTACT SCHEMA
   ============================================ */

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100).trim(),
  email: z.string().email("Enter a valid email address"),
  masjid_name: z.string().max(100).trim().optional().default(""),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters")
    .trim(),
});

export type ContactInput = z.infer<typeof contactSchema>;
