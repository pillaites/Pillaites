import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import Voting from "./Voting"; // Import your Voting component here

export const metadata: Metadata = {
  title: "Voting", // Updated page title to "Voting"
};

export default function Page() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="text-center text-2xl font-bold">Voting</h1> {/* Updated heading */}
        </div>
        <Voting /> {/* Using the Voting component instead of Bookmarks */}
      </div>
      <TrendsSidebar />
    </main>
  );
}
