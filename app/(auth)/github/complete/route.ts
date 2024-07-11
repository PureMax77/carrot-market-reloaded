import db from "@/lib/db";
import {
  getGitAccessToken,
  getGitUserEmail,
  getGitUserProfile,
  goLogin,
} from "@/lib/session";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    // 잘못된 url 접근이므로
    return new Response(null, { status: 400 });
  }

  const { error, access_token } = await getGitAccessToken(code);

  if (error || !access_token) {
    return new Response(null, { status: 400 });
  }

  // profile 정보 획득
  const { id, avatar_url, username } = await getGitUserProfile(access_token);

  // 깃으로 가입한 이력 있는지 검사
  const user = await db.user.findUnique({
    where: {
      github_id: id + "",
    },
    select: {
      id: true,
    },
  });
  if (user) {
    // 이미 가입한 경우
    await goLogin(user.id);
    return redirect("/profile");
  }

  // 이메일 정보 획득
  const { email } = await getGitUserEmail(access_token);
  // username 중복 검사
  const alreadyUser = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  const newUsername = alreadyUser ? `${username}_git` : username;

  // 회원가입
  const newUser = await db.user.create({
    data: {
      username: newUsername,
      github_id: id + "",
      avatar: avatar_url,
      email,
    },
    select: {
      id: true,
    },
  });
  await goLogin(newUser.id);
  return redirect("/profile");
}
