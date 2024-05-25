import { Users2, Video } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import logo from "/public/logo.svg";

export default function Header({ variant }: { variant: string }) {
  const router = useRouter();
  return (
    <header className="w-full flex justify-between items-center px-8 py-4">
      <Image draggable="false" src={logo} alt="logo" className="w-24 md:w-36" />

      <div className="flex justify-center items-center gap-8">
        {variant == "home" ? (
          <Button
            onClick={() => router.push("/access")}
            variant="ghost"
            className="text-orange-500 hover:bg-orange-500 hover:text-neutral-200 hidden md:flex"
          >
            Controlador de acesso <Video className="ml-2 size-5" />
          </Button>
        ) : (
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            className="text-orange-500 hover:bg-orange-500 hover:text-neutral-200 hidden md:flex"
          >
            Clientes <Users2 className="ml-2 size-5" />
          </Button>
        )}

        <div className="flex justify-center items-center gap-3 text-zinc-800">
          <div
            className="flex flex-col justify-center items-end"
            onClick={() => router.push("/login")}
          >
            <span className="text-base">Admin</span>
            <p className="text-red-600  hover:text-red-500 text-sm cursor-pointer">
              sair
            </p>
          </div>
          <div className="size-10 md:size-14 flex justify-center items-center rounded-full text-lg md:text-2xl text-orange-500 border-2 border-orange-500">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
