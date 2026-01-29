"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { deleteProduct } from "@/app/actions/products";
import { toast } from "sonner";

export function ProductActions({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer text-white hover:bg-white/20"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-5 w-5 text-current!" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl text-zinc-400 shadow-2xl shadow-black/50"
      >
        <DropdownMenuLabel className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Asset Controls
        </DropdownMenuLabel>

        <DropdownMenuItem asChild>
          <Link
            href={`/admin/products/${id}/edit`}
            className="flex w-full items-center gap-2 cursor-pointer py-2.5 focus:bg-white/10 focus:text-white rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Configuration</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        {/* DELETE ACTION */}
        <DropdownMenuItem
          className="group flex w-full items-center gap-2 cursor-pointer py-2.5 text-red-500 focus:bg-red-500/10 focus:text-red-400 rounded-lg transition-colors"
          disabled={isPending}
          onSelect={(e) => {
            e.preventDefault();
          }}
          onClick={() => {
            startTransition(async () => {
              // CALL THE SERVER ACTION
              const result = await deleteProduct(id);

              // CHECK THE RETURN VALUE
              if (result && result.error) {
                // FAILURE: Show the specific error from the server
                toast.error("Deletion Blocked", {
                  description: result.error,
                  icon: <AlertCircle className="h-4 w-4 text-red-500" />,
                  duration: 4000,
                });
              } else {
                // SUCCESS: Confirm action
                toast.success("Asset Decommissioned", {
                  description:
                    "The product has been permanently removed from the vault.",
                  duration: 3000,
                });
              }
            });
          }}
        >
          <Trash className="h-4 w-4 transition-transform group-focus:scale-110" />
          <span>{isPending ? "Deleting..." : "Delete Asset"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
