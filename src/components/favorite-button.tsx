"use client";

import { useTransition, useOptimistic } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/app/actions";

export function FavoriteButton({
  id,
  favorite,
}: {
  id: string;
  favorite: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(favorite);

  return (
    <button
      type="button"
      aria-label={optimistic ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={optimistic}
      disabled={pending}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        startTransition(async () => {
          setOptimistic(!optimistic);
          await toggleFavorite(id);
        });
      }}
      className={cn(
        "absolute left-4 top-4 z-30 flex size-9 items-center justify-center rounded-full",
        "bg-white/90 backdrop-blur-md shadow-md transition-transform duration-200",
        "hover:scale-110",
      )}
    >
      <Heart
        className={cn("size-4 transition-all", optimistic && "fill-danger")}
        color="#C1554F"
        strokeWidth={2}
      />
    </button>
  );
}
