import * as z from "zod";

export const SettingsSchema = z.object({
  storeName: z.string().min(1, {
    message: "É necessário informar um nome",
  }),
  imageUrl: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  myUserName: z.string().min(1, {
    message: "É necessário informar um nome",
  }),
  email: z.string().email().optional(),
  password: z
    .string()
    .min(6, {
      message: "É necessário informar pelo menos 6 caracteres",
    })
    .optional(),
  newPassword: z.optional(
    z.string().min(6, {
      message: "É necessário informar pelo menos 6 caracteres",
    })
  ),
});

export const UpdatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, {
        message: "É necessário informar pelo menos 6 caracteres",
      })
      .optional(),
    newPassword: z.optional(
      z.string().min(6, {
        message: "É necessário informar pelo menos 6 caracteres",
      })
    ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().min(1, {
    message: "Informe sua senha",
  }),
  code: z.optional(z.string()),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "É necessário informar um email",
  }),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Informe pelo menos 6 caracteres",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email inválido",
  }),
  password: z.string().min(6, {
    message: "São necessárias no mínimo 6 caracteres",
  }),
  name: z.string().min(1, {
    message: "É necessário informar um nome",
  }),
});

export const CreateStoreSchema = z.object({
  name: z.string().min(1, {
    message: "É necessário informar ao menos 1 letra",
  }),
});

export const CreateBillboardSchema = z.object({
  label: z.string().min(1, {
    message: "É necessário informar ao menos 1 letra",
  }),
  imageUrl: z.string().min(1, {
    message: "É necessário inserir uma imagem",
  }),
  description: z
    .optional(
      z.string().max(50, {
        message: "No máximo 50 caracteres",
      })
    )
    .nullable(),
});

export const UploadImage = z.object({
  label: z.string().min(1),
  imageUrl: z.string().min(1),
});

export const CategorySchema = z.object({
  name: z.string().min(1, {
    message: "É necessário informar ao menos 1 letra",
  }),
  billboardId: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  value: z.string().optional().nullable(),
});

export const ColorSchema = z.object({
  name: z.string().min(2),
  value: z.string().min(4).max(9).regex(/^#/, {
    message: "Esse campo precisa ser um código hex",
  }),
});

export const ProductSchema = z.object({
  name: z.string().min(1, {
    message: "É necessário informar ao menos 1 letra",
  }),
  description: z.string().min(1, {
    message: "É necessário informar ao menos 1 letra",
  }),
  images: z.object({ url: z.string() }).array(),
  sizes: z
    .object({
      name: z.string(),
      value: z.string(),
      quantity: z.coerce.number(),
    })
    .array(),
  price: z.string(),
  priceInCents: z.coerce.number().optional(),
  categoryId: z.string().min(1, {
    message: "Selecione uma categoria",
  }),
  colorId: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  isNew: z.boolean().default(false).optional(),
});

export const ReviewSchema = z.object({
  reply: z
    .string()
    .min(1, {
      message: "É necessário informar ao menos 1 letra",
    })
    .nullable(),
});
