import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function AIOutput({ content, loading }: { content: string; loading: boolean }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  if (loading) {
    return (
      <Card className="shadow-[var(--shadow-soft)]">
        <CardContent className="space-y-3 p-6">
          <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  if (!content) return null;

  return (
    <Card className="shadow-[var(--shadow-soft)]">
      <CardContent className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Result</span>
          <Button size="sm" variant="ghost" onClick={copy}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="ml-1.5">{copied ? "Copied" : "Copy"}</span>
          </Button>
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground">{content}</pre>
        <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
          ⚠ AI-generated content may require human review.
        </p>
      </CardContent>
    </Card>
  );
}