import { OAuth2Client } from 'google-auth-library';
import { cookies } from 'next/headers';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID; // Get Google Client ID from environment variables
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET; // Get Google Client Secret from environment variables
const REDIRECT_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback/google`; // Redirect URL using base URL from environment variables

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code"); // Get the code from the query parameters
  const state = cookies().get("state")?.value; // Retrieve state from cookies
  const codeVerifier = cookies().get("code_verifier")?.value; // Retrieve code verifier from cookies

  try {
    // Exchange the authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens); // Set the credentials for the client

    // Make a request to get user information
    const userInfoResponse = await oauth2Client.request({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`, // Include access token in the header
      },
    });

    const userInfo = userInfoResponse.data; // Get user information
    const email = userInfo.email; // Extract email

    // Validate the user's email or perform any necessary operations
    console.log("Authenticated user's email:", email);

    return new Response("User authenticated successfully!"); // Return a success response
  } catch (error) {
    console.error("Authentication error:", error); // Log any errors for debugging
    return new Response("Authentication failed", { status: 500 }); // Return a failure response
  }
}
