import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIOutput } from "@/components/AIOutput";
import { callAI } from "@/lib/ai";
import { toast } from "sonner";
import { Mail, Wand2 } from "lucide-react";

export const Route = createFileRoute("/email")({
  head: () => ({ meta: [{ title: "Smart Email Generator — WorkAI" }] }),
  component: EmailPage,
});

function EmailPage() {
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("");
  const [purpose, setPurpose] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!purpose.trim()) return toast.error("Please describe the email's purpose");
    setLoading(true);
    setOutput("");
    try {
      const prompt = `Tone: ${tone}\nAudience: ${audience || "General professional"}\nPurpose / Key points:\n${purpose}`;
      const res = await callAI({ task: "email", input: prompt });
      setOutput(res);
    } catch (e: any) {
      toast.error(e.message || "Failed to generate email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Smart Email Generator">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" /> Email details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Professional", "Friendly", "Persuasive", "Apologetic", "Concise", "Enthusiastic", "Formal"].map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. Senior executive, new client, internal team" />
            </div>
            <div className="space-y-2">
              <Label>Purpose & key points</Label>
              <Textarea rows={8} value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Describe what the email should accomplish and any key facts to include..." />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              <Wand2 className="mr-2 h-4 w-4" />
              {loading ? "Generating..." : "Generate Email"}
            </Button>
          </CardContent>
        </Card>
        <AIOutput content={output} loading={loading} />
      </div>
    </AppShell>
  );
}