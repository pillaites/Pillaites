import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';

// Define an interface for the user information expected from Google
interface UserInfo {
  id: string;
  email: string;
  name: string;
  picture: string;
  // Add any other fields needed from the user info
}

// Initialize the OAuth2 client with your credentials
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback` // Redirect URL
);

// Handler for the OAuth2 callback route
export async function GET(request: Request) {
  // Extract the authorization code from the request URL
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Check if the authorization code is provided
  if (!code) {
    return NextResponse.error(); // Return an error response if no code is provided
  }

  try {
    // Exchange the authorization code for tokens
    const tokenResponse = await oauth2Client.getToken(code);
    const tokens = tokenResponse.tokens;

    // Set the credentials for the OAuth2 client
    oauth2Client.setCredentials(tokens);

    // Make a request to get user information from Google
    const userInfoResponse = await oauth2Client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`, // Include the access token in the request header
      },
    });

    // Assert the type of the response data to UserInfo
    const userInfo = userInfoResponse.data as UserInfo; 
    const email = userInfo.email; // Extract the user's email

    // Log the authenticated user's email for debugging
    console.log("Authenticated user's email:", email);

    // Add logic here to save the user info to your database if needed

    // Return a successful response with user information
    return NextResponse.json({ message: 'User authenticated successfully!', user: userInfo }); 
  } catch (error) {
    // Handle errors that occur during the authentication process
    console.error("Authentication error:", error);
    
    // Return a failure response with error details
    return NextResponse.json(
      { message: 'Authentication failed', error: (error as Error).message }, // Type assertion for error
      { status: 500 } // HTTP status code for server error
    ); 
  }
}
