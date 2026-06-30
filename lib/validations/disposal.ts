import { z } from "zod";
import { trashCategories } from "@/lib/trash";

export const disposalSchema = z.object({
  categoryKey: z.enum(trashCategories.map((category) => category.key) as [string, ...string[]]),
  itemCount: z.coerce.number().int().min(1).max(100)
});
