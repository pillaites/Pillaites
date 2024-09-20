import { Metadata } from "next";
import Chat from "./Chat";

export const metadata: Metadata = {
  title: "Messages",
};

export default function Page() {
  return (
    <div className="h-screen w-full">
      <Chat />
    </div>
  );
}
