import { google } from 'googleapis'; // Assuming googleapis is used
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Callback route after Google OAuth redirect
export async function callback({ request }: { request: NextRequest }) {
  const code = request.query.get('code');
  const state = request.cookies.get("state");
  const codeVerifier = request.cookies.get("code_verifier");

  if (!code || !state || !codeVerifier) {
    return new Response("Invalid request", { status: 400 });
  }

  try {
    // Exchange authorization code for tokens using the googleapis library
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      'YOUR_REDIRECT_URI' // Replace with your actual redirect URI
    );

    const { tokens } = await oauth2Client.getToken({
      code,
      codeVerifier,
    });

    oauth2Client.setCredentials(tokens);

    // Get user info
    const userInfo = await google.oauth2("v2").userinfo.get({
      auth: oauth2Client,
    });

    const email = userInfo.data.email;

    // Validate email in the database
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
      return new Response("Unauthorized: Email not invited or registered", { status: 401 });
    }

    // Continue with authentication or user creation
    return new Response("User authenticated successfully!");
  } catch (error) {
    console.error("OAuth callback error:", error);
    return new Response("Authentication failed", { status: 500 });
  }
}
