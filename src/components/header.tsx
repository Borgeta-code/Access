import { LogOut, ScanFace, Users2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import logo from "/public/logo.svg";

export default function Header({ isHome = false }: { isHome?: boolean }) {
  const router = useRouter();
  return (
    <header className="w-full flex justify-between items-center px-8 py-4">
      <Image draggable="false" src={logo} alt="logo" className="w-24 md:w-36" />

      <div className="flex justify-center items-center gap-8">
        {isHome ? (
          <Button onClick={() => router.push("/detector")} variant="ghost">
            Detector Facial <ScanFace className="ml-2 size-5" />
          </Button>
        ) : (
          <Button onClick={() => router.push("/")} variant="ghost">
            Clientes <Users2 className="ml-2 size-5" />
          </Button>
        )}

        <div className="flex justify-center items-center gap-3 text-zinc-800">
          <div
            className="flex flex-col justify-center items-end"
            onClick={() => router.push("/login")}
          >
            <p className="text-base">Admin</p>
            <div className="flex items-center cursor-pointer gap-1 text-red-600 hover:text-red-500">
              <p className="text-sm">sair</p>
              <LogOut className="size-3" />
            </div>
          </div>
          <div className="size-10 md:size-12 flex justify-center items-center rounded-full text-lg md:text-2xl text-orange-500 border-2 border-orange-500">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
