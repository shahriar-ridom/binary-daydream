"use client";

import { createDownloadLink } from "@/app/actions/download";
import { Button } from "./ui/button";
import { useTransition } from "react";

export function DownloadButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDownload = () => {
    startTransition(async () => {
      // The server action will throw a redirect error on success,
      // so we only need to catch "real" errors.
      try {
        const result = await createDownloadLink(orderId);
        if (result && result.error) {
          alert(result.error); // Replace with toast.error() if you have it
        }
      } catch (error) {
        // Next.js Redirects are technically "errors", so we ignore them
        // If it's NOT a redirect error, then we alert.
        if (
          !(error instanceof Error) ||
          !error.message.includes("NEXT_REDIRECT")
        ) {
          console.error(error);
        }
      }
    });
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isPending}
      variant="outline"
      size="sm"
    >
      {isPending ? "Generating..." : "Download Asset"}
    </Button>
  );
}
