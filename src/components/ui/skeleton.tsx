import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-2xl border-2 border-zinc-300 flex items-center justify-center gap-4 px-6 py-4",
        className
      )}
      {...props}
    >
      <div className="size-24 rounded-2xl bg-zinc-300" />
      <div className="flex flex-col gap-2">
        <div className="w-20 h-5 rounded-md bg-zinc-300" />
        <div className="w-20 h-5 rounded-md bg-zinc-300" />
      </div>
    </div>
  );
}

export { Skeleton };
