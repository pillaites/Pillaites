import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

// Define an interface for the user information you expect from Google
interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  // Add any other fields you need from the user info
}

// Initialize the OAuth2 client with your credentials
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback` // Redirect URL
);

// Handler for the OAuth2 callback route
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.error(); // Handle the case where no code is provided
  }

  try {
    // Exchange the authorization code for tokens
    const tokenResponse = await oauth2Client.getToken(code);
    const tokens = tokenResponse.tokens;

    // Set the credentials for the client
    oauth2Client.setCredentials(tokens);

    // Make a request to get user information
    const userInfoResponse = await oauth2Client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`, // Include access token in the header
      },
    });

    const userInfo = userInfoResponse.data as UserInfo; // Cast to UserInfo type
    const email = userInfo.email;

    // Validate the user's email or perform any necessary operations
    console.log("Authenticated user's email:", email);

    // You can add logic here to save the user info to your database if needed

    return NextResponse.json({ message: 'User authenticated successfully!', user: userInfo }); // Return user info as JSON
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ message: 'Authentication failed', error: error.message }, { status: 500 }); // Return a failure response
  }
}
