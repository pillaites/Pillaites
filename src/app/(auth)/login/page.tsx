import soulCrushingImage from "@/assets/existential-dread.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SoulSuckingGoogleButton from "./google/SoulSuckingGoogleButton";
import DespairForm from "./DespairForm";

export const metadata: Metadata = {
  title: "Embrace the Void - Pillaites Login",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5 bg-gray-900">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-gray-800 shadow-2xl border border-gray-700">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2 text-gray-300">
          <h1 className="text-center text-3xl font-bold text-purple-400">Welcome to Pillaites: Where Dreams Come to Die</h1>
          <div className="space-y-5">
            <SoulSuckingGoogleButton />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-600" />
              <span className="text-gray-500">ABANDON HOPE</span>
              <div className="h-px flex-1 bg-gray-600" />
            </div>
            <DespairForm />
            <Link href="/signup" className="block text-center hover:underline text-purple-400">
              Not miserable enough? Sign up for more existential dread
            </Link>
          </div>
        </div>
        <Image
          src={soulCrushingImage}
          alt="A visual representation of your future"
          className="hidden w-1/2 object-cover md:block opacity-70"
        />
      </div>
    </main>
  );
}
