import { OAuth2Client } from 'google-auth-library'; // Use the correct library
import { cookies } from 'next/headers';
import prisma from "@/lib/prisma"; // Adjust import as necessary

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URL
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = cookies().get("state")?.value;
  const codeVerifier = cookies().get("code_verifier")?.value;

  if (!code) {
    return new Response("Code not provided", { status: 400 });
  }

  try {
    // Use the correct method to get tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfoResponse = await oauth2Client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userInfo = userInfoResponse.data;
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

    return new Response("User authenticated successfully!", { status: 200 });
  } catch (error) {
    console.error("Authentication error:", error);
    return new Response("Authentication failed", { status: 500 });
  }
}
