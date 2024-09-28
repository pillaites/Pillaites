import { google } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET request to initiate Google OAuth
export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  // Generate the Google OAuth URL
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  // Set cookies for state and code_verifier with security settings
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

  // Redirect user to Google authentication URL
  return NextResponse.redirect(url);
}

// Handle the callback after Google OAuth
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  // Retrieve state and code_verifier from cookies
  const state = request.cookies.get("state")?.value;
  const codeVerifier = request.cookies.get("code_verifier")?.value;

  if (!code || !state || !codeVerifier) {
    return new Response("Invalid request", { status: 400 });
  }

  try {
    // Exchange the authorization code for tokens
    const tokenResponse = await google.handleAuthorizationCallback({
      code,
      codeVerifier,
      state,
    });

    // Fetch user info using the access token
    const userInfo = await google.getUserInfo(tokenResponse.access_token);
    const email = userInfo.email;

    // Validate if the email exists in either the invites or users table
    const isEmailValid = await prisma.$transaction(async (tx) => {
      const invite = await tx.invite.findFirst({
        where: { email },
      });

      const user = await tx.user.findFirst({
        where: { email },
      });

      return !!invite || !!user;
    });

    if (!isEmailValid) {
      return new Response("Unauthorized: You are not a Pillaite!", { status: 401 });
    }

    // Further logic for authenticated users
    // (e.g., sign in existing user or create a new account)
    return new Response("You are Pillaite!", { status: 200 });
  } catch (error) {
    console.error("OAuth callback error:", error);
    return new Response("Authentication failed", { status: 500 });
  }
}
