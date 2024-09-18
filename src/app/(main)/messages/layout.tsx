// src/app/(main)/messages/layout.tsx

import { Metadata } from "next";
import Page from "./page";

export const metadata: Metadata = {
  title: "Messages",
};

export default function MessagesLayout() {
  return (
    <div>
      <Page />
    </div>
  );
}
