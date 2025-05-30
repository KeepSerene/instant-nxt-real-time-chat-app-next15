"use client";

import { useCallback, useState } from "react";
import { useMutation } from "convex/react";

export function usePendingMutation(mutationToRun: any) {
  const [isPending, setIsPending] = useState(false);

  const mutationFn = useMutation(mutationToRun);

  const mutate = useCallback(
    async (payload: any) => {
      setIsPending(true);

      try {
        return await mutationFn(payload);
      } catch (err) {
        console.error("Oops! Something went wrong:", err);

        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [mutationFn]
  );

  return { isPending, mutate };
}
