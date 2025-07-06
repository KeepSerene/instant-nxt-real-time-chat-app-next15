import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";

export const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getChatById(chatId: Id<"chats">) {
  return await convex.query(api.chat.get, { id: chatId });
}
