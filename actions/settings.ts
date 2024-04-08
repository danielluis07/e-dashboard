"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { SettingsSchema, UpdatePasswordSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";

export const updateSettings = async (
  values: z.infer<typeof SettingsSchema>,
  params: { storeId: string }
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Não autorizado!" };
  }

  const validatedFields = SettingsSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Campos inválidos!" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Não autorizado!" };
  }

  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  if (values.email && values.email !== user.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== user.id) {
      return { error: "Esse email já está em uso!" };
    }

    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Email de verificação enviado!" };
  }

  try {
    await db.myUser.update({
      where: { id: dbUser.id },
      data: {
        name: values.myUserName,
        email: values.email,
        image: values.imageUrl,
        isTwoFactorEnabled: values.isTwoFactorEnabled,
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "Erro ao atualizar as informações" };
  }

  revalidatePath(`/dashboard/${params.storeId}/settings`);
  return { success: "Informações atualizadas!" };
};

export const updatePassword = async (
  values: z.infer<typeof UpdatePasswordSchema>,
  params: { storeId: string }
) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Não autorizado!" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Não autorizado!" };
  }

  if (user.isOAuth) {
    values.password = undefined;
    values.newPassword = undefined;
  }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordsMatch) {
      return { error: "Senha incorreta!" };
    }

    try {
      const hashedPassword = await bcrypt.hash(values.newPassword, 10);
      values.password = hashedPassword;
      values.newPassword = undefined;

      await db.myUser.update({
        where: { id: dbUser.id },
        data: {
          password: hashedPassword,
        },
      });
    } catch (error) {
      console.log(error);
      return { error: "Erro ao atualizar as informações" };
    }
  }

  revalidatePath(`/dashboard/${params.storeId}/settings`);
  return { success: "Informações atualizadas!" };
};
