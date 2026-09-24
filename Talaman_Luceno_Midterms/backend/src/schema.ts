import { z } from "zod";

export const microserviceBodySchema = z.object({
  name: z.string().min(3, "Name must at least be 3 characters."),
  endpoint_url: z.string().min(2, "Endpoint URL is required."),
  enviornment: z.string().min(2, "Environment is required."),
  status: z.string().min(2, "Status is required."),
  version: z.string().min(2, "Version is required."),
});

// Create a wrapper schema for our generic Express middleware
export const createMicroserviceSchema = z.object({
  body: microserviceBodySchema,
});

export const updateMicrosericeSchema = z.object({
  body: microserviceBodySchema.partial(),
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a numeric string"),
  }),
});

// Automatically infer TypeScript types from the Zod schemas
export type MicroserviceInput = z.infer<typeof microserviceBodySchema>;

export const authBodySchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const authRequestSchema = z.object({
  body: authBodySchema,
});

export type AuthInput = z.infer<typeof authBodySchema>;