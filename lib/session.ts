import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SessionContent {
  id?: number;
}
interface IAccessTokenData {
  error?: string;
  access_token?: string;
}
interface IGitUserProfile {
  id: number;
  avatar_url: string;
  username: string; // username
}
interface IGitUserEmail {
  email: string;
}

export default function getSession() {
  return getIronSession<SessionContent>(cookies(), {
    cookieName: "delicious-karrot",
    password: process.env.COOKIE_PASSWORD!, /// 쿠키암호화 secret
  });
}

export async function goLogin(
  userId: string | number,
  redirectPath: string = ""
) {
  // 쿠키가 있으면 내용을 업데이트 없으면 새로 만듬
  const session = await getSession();
  session.id = Number(userId);
  await session.save();

  if (redirectPath) {
    redirect(redirectPath);
  }
}

export async function getGitAccessToken(
  code: string
): Promise<IAccessTokenData> {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenData = await (
    await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  const { error, access_token } = accessTokenData;

  return { error, access_token };
}

export async function getGitUserProfile(
  access_token: string
): Promise<IGitUserProfile> {
  // 고객정보 조회
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache", // 모든 사용자가 다를 것이기 때문
  });

  // login은 닉네임임
  const { id, avatar_url, login } = await userProfileResponse.json();

  return { id, avatar_url, username: login };
}

export async function getGitUserEmail(
  access_token: string
): Promise<IGitUserEmail> {
  // 고객정보 조회
  const userProfileResponse = await fetch(
    "https://api.github.com/user/emails",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache", // 모든 사용자가 다를 것이기 때문
    }
  );

  // login은 닉네임임
  const [{ email }] = await userProfileResponse.json();

  return { email };
}
