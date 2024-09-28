import { NextResponse } from 'next/server';
import { OAuth2Client, GetTokenResponse } from 'google-auth-library';

// Define an interface for the user information you expect from Google
interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
}

// Initialize the OAuth2 client with your credentials
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
);

// Handler for the OAuth2 callback route
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.error(); // Handle the case where no code is provided
  }

  try {
    // Await the token response
    const tokenResponse: GetTokenResponse = await oauth2Client.getToken(code);
    const tokens = tokenResponse.tokens; // Access tokens here

    // Set the credentials for the client
    oauth2Client.setCredentials(tokens);

    // Make a request to get user information
    const userInfoResponse = await oauth2Client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userInfo = userInfoResponse.data as UserInfo;
    const email = userInfo.email;

    console.log("Authenticated user's email:", email);

    return NextResponse.json({ message: 'User authenticated successfully!', user: userInfo });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ message: 'Authentication failed', error: (error as Error).message }, { status: 500 });
  }
}
