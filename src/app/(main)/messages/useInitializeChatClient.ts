import kyInstance from "@/lib/ky";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useSession } from "../SessionProvider";

export default function useInitializeChatClient() {
  const { user } = useSession();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  useEffect(() => {
    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    const connectUser = async () => {
      try {
        const { token } = await kyInstance.get("/api/get-token").json<{ token: string }>();
        
        await client.connectUser(
          {
            id: user.id,
            username: user.username,
            name: user.displayName,
            image: user.avatarUrl,
          },
          token
        );

        setChatClient(client);
      } catch (error) {
        console.error("Failed to connect user", error);
      }
    };

    connectUser();

    return () => {
      const disconnectUser = async () => {
        setChatClient(null);
        try {
          await client.disconnectUser();
          console.log("User disconnected successfully");
        } catch (error) {
          console.error("Failed to disconnect user", error);
        }
      };

      disconnectUser();
    };
  }, [user.id, user.username, user.displayName, user.avatarUrl]);

  return chatClient;
}
