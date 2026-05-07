import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AIOutput } from "@/components/AIOutput";
import { callAI } from "@/lib/ai";
import { toast } from "sonner";
import { FileText, Wand2 } from "lucide-react";

export const Route = createFileRoute("/meeting")({
  head: () => ({ meta: [{ title: "Meeting Notes Summarizer — WorkAI" }] }),
  component: Page,
});

function Page() {
  const [notes, setNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!notes.trim()) return toast.error("Paste your meeting notes or transcript");
    setLoading(true);
    setOutput("");
    try {
      const res = await callAI({ task: "meeting", input: notes });
      setOutput(res);
    } catch (e: any) {
      toast.error(e.message || "Failed to summarize");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Meeting Notes Summarizer">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
        <Card className="shadow-[var(--shadow-soft)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Meeting notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Paste transcript or raw notes</Label>
              <Textarea rows={14} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Paste meeting transcript or rough notes here..." />
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              <Wand2 className="mr-2 h-4 w-4" />
              {loading ? "Summarizing..." : "Summarize Meeting"}
            </Button>
          </CardContent>
        </Card>
        <AIOutput content={output} loading={loading} />
      </div>
    </AppShell>
  );
}