import { supabase } from "@/integrations/supabase/client";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function callAI(opts: {
  task: "email" | "meeting" | "tasks" | "research" | "chat";
  input?: string;
  messages?: ChatMessage[];
}): Promise<string> {
  const { data, error } = await supabase.functions.invoke("ai-assistant", {
    body: opts,
  });
  if (error) {
    throw new Error(error.message || "AI request failed");
  }
  if ((data as any)?.error) throw new Error((data as any).error);
  return (data as any).content as string;
}