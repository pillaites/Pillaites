import SearchField from "@/components/SearchField";
import UserButton from "@/components/UserButton";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";  

export default function Navbar() {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center px-5 py-3">
        <Link href="/" className="flex items-center">
          <Image src={logo} alt="Logo" width={40} height={40} className="object-contain" />
        </Link>
        <div className="flex-grow"></div>  
        <SearchField className="ml-4" />  
        <UserButton className="ml-4" />  
      </div>
    </header>
  );
}
