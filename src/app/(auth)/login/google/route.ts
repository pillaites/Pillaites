import { google } from "@/auth";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";  // Import the Prisma client

export async function GET() {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();

  // Create the Google authorization URL
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: ["profile", "email"],
  });

  // Store state and code_verifier in cookies for later verification
  cookies().set("state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  cookies().set("code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10, // 10 minutes
    sameSite: "lax",
  });

  // Redirect the user to Google for authentication
  return Response.redirect(url);
}

// New function to handle the OAuth callback and email verification
export async function handleGoogleCallback(request) {
  const { code } = request.query;

  // Verify the state and code_verifier from cookies
  const storedState = cookies().get("state");
  const storedCodeVerifier = cookies().get("code_verifier");

  if (!storedState || !storedCodeVerifier) {
    return new Response("Invalid OAuth state", { status: 400 });
  }

  // Exchange the code for tokens and retrieve the user's profile
  const tokens = await google.exchangeCodeForTokens({
    code,
    codeVerifier: storedCodeVerifier,
  });

  const userProfile = await google.getUserProfile(tokens.access_token);

  // Check if the user's email exists in the Invite table
  const invitedUser = await prisma.invite.findUnique({
    where: { email: userProfile.email },
  });

  // If the email is not in the invite list, deny access
  if (!invitedUser) {
    return new Response("Your email is not on the invite list.", { status: 403 });
  }

  // If the email is in the invite list, proceed with account creation or login
  // ... (your existing account creation or session logic here)

  // Optionally, remove the email from the Invite table after successful signup
  await prisma.invite.delete({
    where: { email: userProfile.email },
  });

  // Redirect to the homepage or dashboard after successful login/signup
  return Response.redirect("/");
}
