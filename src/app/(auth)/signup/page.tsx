import soulHarvestingImage from "@/assets/eternal-suffering.jpg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SelfDestructionForm from "./SelfDestructionForm";

export const metadata: Metadata = {
  title: "Pillaites: Embrace the Void",
};

export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-5 bg-gray-900">
      <div className="flex h-full max-h-[40rem] w-full max-w-[64rem] overflow-hidden rounded-2xl bg-gray-800 shadow-2xl border border-gray-700">
        <div className="w-full space-y-10 overflow-y-auto p-10 md:w-1/2 text-gray-300">
          <div className="space-y-1 text-center">
            <h1 className="text-3xl font-bold text-purple-400">Sign Your Life Away to Pillaites</h1>
            <p className="text-gray-500">
              Where <span className="italic">even you</span> can find someone to ignore your messages.
            </p>
          </div>
          <div className="space-y-5">
            <SelfDestructionForm />
            <Link href="/login" className="block text-center hover:underline text-purple-400">
              Already regretting your life choices? Log in and spiral further
            </Link>
          </div>
        </div>
        <Image
          src={soulHarvestingImage}
          alt="A glimpse into your future social life"
          className="hidden w-1/2 object-cover md:block opacity-70 grayscale"
        />
      </div>
    </main>
  );
}
