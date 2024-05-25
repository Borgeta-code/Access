import { api } from "@/lib/api";
import { Client } from "@/types/client";
import { LockKeyholeIcon, LockKeyholeOpen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Card({ client }: { client: Client }) {
  const [permission, setPermission] = useState(client.isAllowed);

  const handlePermission = async () => {
    const newPermission = !permission;
    setPermission(newPermission);

    await api.put(`/client/permission?id=${client.id}`);

    if (newPermission) {
      return toast.success(
        `Acesso liberado para ${client.name.split(" ")[0]}`,
        {
          style: {
            background: "rgb(249 115 22)",
            color: "#ffff",
          },
          iconTheme: {
            primary: "#ffff",
            secondary: "rgb(249 115 22)",
          },
        }
      );
    } else {
      return toast.error(`Acesso bloqueado para ${client.name.split(" ")[0]}`, {
        style: {
          background: "rgb(249 115 22)",
          color: "#ffff",
        },
        iconTheme: {
          primary: "#ffff",
          secondary: "rgb(249 115 22)",
        },
      });
    }
  };

  return (
    <div className="relative flex justify-center items-center gap-4 p-4 rounded-xl shadow-md border-2 border-orange-500">
      <Image
        width={200}
        height={200}
        draggable="false"
        className="size-24 rounded-full object-cover border-2 border-orange-500"
        alt="imagem-cliente"
        src={client.faceImageUrl}
      />

      <p className="text-base font-medium text-orange-500">{client.name}</p>

      {/* <Button className="w-full bg-orange-500/60 hover:bg-orange-500">
        Excluir <Trash className="ml-2 size-4" />
      </Button> */}

      {permission == true ? (
        <div
          onClick={handlePermission}
          className="absolute -top-4 -right-4 flex justify-center items-center p-3 rounded-full text-neutral-200 cursor-pointer bg-green-500/80 hover:bg-green-500"
        >
          <LockKeyholeOpen className="size-5" />
        </div>
      ) : (
        <div
          onClick={handlePermission}
          className="absolute -top-4 -right-4 flex justify-center items-center p-3 rounded-full text-neutral-200 cursor-pointer bg-red-600/80 hover:bg-red-600"
        >
          <LockKeyholeIcon className="size-5" />
        </div>
      )}
    </div>
  );
}
