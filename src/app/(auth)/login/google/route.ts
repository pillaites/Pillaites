import { google } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  cookies().set("state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  cookies().set("code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return Response.redirect(url);
}

// Callback route after Google redirect
export async function callback({ request }) {
  const code = request.query.get('code');
  const state = request.cookies.get("state");
  const codeVerifier = request.cookies.get("code_verifier");

  try {
    // Verify and exchange the authorization code for tokens
    const tokenResponse = await google.handleAuthorizationCallback({
      code,
      codeVerifier,
      state
    });

    const userInfo = await google.getUserInfo(tokenResponse.access_token);

    // Extract email from userInfo
    const email = userInfo.email;

    // Check if the email exists in either Invite or User table
    const isEmailValid = await prisma.$transaction(async (tx) => {
      const invite = await tx.invite.findFirst({
        where: {
          email: email,
        },
      });

      const user = await tx.user.findFirst({
        where: {
          email: email,
        },
      });

      return invite !== null || user !== null;
    });

    if (!isEmailValid) {
      return new Response("Unauthorized: Email not invited or registered", { status: 401 });
    }

    // Proceed with the authentication or account creation
    // You could either create a new user or sign in an existing one
    // (depends on your application's logic)

    return new Response("User authenticated successfully!");
  } catch (error) {
    console.error(error);
    return new Response("Authentication failed", { status: 500 });
  }
}
