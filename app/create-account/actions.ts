"use server";
import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => !username.includes("potato");
const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!!!",
        required_error: "Where is my username???",
      })
      .toLowerCase()
      .trim()
      // .transform((username) => `🔥${username}🔥`)
      .refine(checkUsername, "No potatoes allowed!"),
    email: z.string().email().toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH),
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This username is already taken.",
        path: ["username"],
        fatal: true, // 해당 에러 발생시 남은 검증들은 하지 않기 위해
      });
      z.NEVER; // 해당 에러 발생시 남은 검증들은 하지 않기 위해
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "This email is already taken.",
        path: ["email"],
        fatal: true, // 해당 에러 발생시 남은 검증들은 하지 않기 위해
      });
      z.NEVER; // 해당 에러 발생시 남은 검증들은 하지 않기 위해
    }
  })
  .refine(checkPassword, {
    message: "Both passwords should be the same!",
    path: ["confirm_password"], // 에러 발생 지점 설정
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // hash password
    const hashedPassword = await bcrypt.hash(result.data.password, 12);
    // save the user to db
    const user = await db.user.create({
      data: {
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    // log the user in
    // 쿠키가 있으면 내용을 업데이트 없으면 새로 만듬
    const session = await getSession();
    session.id = user.id;
    await session.save();
    //redirect home
    redirect("/profile");
  }
}
