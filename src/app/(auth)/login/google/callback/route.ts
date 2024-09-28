import { google } from "@/auth";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = cookies().get("state")?.value;
  const codeVerifier = cookies().get("code_verifier")?.value;

  try {
    const tokenResponse = await google.handleAuthorizationCallback({
      code,
      codeVerifier,
      state,
    });

    const userInfo = await google.getUserInfo(tokenResponse.access_token);
    const email = userInfo.email;

    const isEmailValid = await prisma.$transaction(async (tx) => {
      const invite = await tx.invite.findFirst({
        where: { email },
      });

      const user = await tx.user.findFirst({
        where: { email },
      });

      return invite !== null || user !== null;
    });

    if (!isEmailValid) {
      return new Response("Unauthorized: Email not invited or registered", { status: 401 });
    }

    return new Response("User authenticated successfully!");
  } catch (error) {
    console.error(error);
    return new Response("Authentication failed", { status: 500 });
  }
}
