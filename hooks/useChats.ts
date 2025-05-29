import { useParams } from "next/navigation";
import { useMemo } from "react";

export function useChats() {
  const params = useParams();

  const chatId = useMemo(
    () => (params?.chatId ?? "") as string,
    [params?.chatId]
  );
  const isActive = useMemo(() => Boolean(chatId), [chatId]);

  return {
    chatId,
    isActive,
  };
}
