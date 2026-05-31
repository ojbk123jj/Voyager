import { z } from "zod";

/**
 * 旅行日志表单校验。
 * 服务端是信任边界，所有写操作都先过这里。
 */
export const entryInputSchema = z
  .object({
    destination: z.string().trim().min(1, "Destination is required").max(120),
    country: z.string().trim().min(1, "Country is required").max(120),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date"),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date"),
    rating: z.coerce.number().int().min(1, "Pick a rating").max(5),
    review: z.string().trim().min(1, "Review is required").max(5000),
    mood: z.string().trim().max(8).optional().or(z.literal("")),
    tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
    imageUrl: z
      .string()
      .trim()
      .url("Must be a valid URL")
      .max(2000)
      .optional()
      .or(z.literal("")),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });

export type EntryInput = z.infer<typeof entryInputSchema>;

/** 可选的 mood 列表，前端按钮和校验共用 */
export const MOODS = [
  { value: "🌊", label: "Coastal" },
  { value: "🏔️", label: "Mountain" },
  { value: "🏛️", label: "Historical" },
  { value: "🌆", label: "Urban" },
  { value: "🌴", label: "Tropical" },
  { value: "🌸", label: "Nature" },
  { value: "☕", label: "Cultural" },
  { value: "🎨", label: "Artistic" },
] as const;
