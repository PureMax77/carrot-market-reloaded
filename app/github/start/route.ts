// api routes

import { redirect } from "next/navigation";

export async function GET() {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
    allow_signup: "true", // 깃헙 미가입자경우 가입하고 바로 승인 가능하게, 디폴트 값인데 그냥 넣음
  };
  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseUrl}?${formattedParams}`;
  return redirect(finalUrl);
}
