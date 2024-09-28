import { google } from 'googleapis'; // Assuming you're using googleapis library

export async function callback({ request }) {
  const code = request.query.get('code');
  const state = request.cookies.get("state");
  const codeVerifier = request.cookies.get("code_verifier");

  if (!code || !state || !codeVerifier) {
    return new Response("Invalid request", { status: 400 });
  }

  try {
    // Exchange the authorization code for tokens using googleapis
    const { tokens } = await google.oauth2("v2").getToken({
      code,
      codeVerifier,
      redirect_uri: 'YOUR_REDIRECT_URI', // Make sure to include your redirect URI
    });

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials(tokens);

    // Fetch user info
    const userInfo = await google.oauth2("v2").userinfo.get({
      auth: oauth2Client,
    });

    const email = userInfo.data.email;

    // Validate email in the database (similar to your previous logic)
    const isEmailValid = await prisma.$transaction(async (tx) => {
      const invite = await tx.invite.findFirst({ where: { email } });
      const user = await tx.user.findFirst({ where: { email } });
      return !!invite || !!user;
    });

    if (!isEmailValid) {
      return new Response("Unauthorized: Email not invited or registered", { status: 401 });
    }

    // Handle the rest of your authentication logic here
    return new Response("User authenticated successfully!");
  } catch (error) {
    console.error("OAuth callback error:", error);
    return new Response("Authentication failed", { status: 500 });
  }
}
