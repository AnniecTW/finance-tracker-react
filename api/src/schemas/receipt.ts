import { z } from "zod";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Housing",
  "Entertainment",
  "Health",
  "Other",
] as const;

export const receiptSchema = z.object({
  merchant: z.string().nullable().catch(null),
  total_amount: z.coerce.number().nullable().catch(null),
  currency: z.string().nullable().catch(null),
  date: z.string().nullable().catch(null),
  suggested_category: z.enum(CATEGORIES).catch("Other"),
});

export type Receipt = z.infer<typeof receiptSchema>;
