import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, FileText, ListTodo, Search, MessageSquare, ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Automate daily work tasks with AI: email drafts, meeting notes, planning, research, and chat." },
    ],
  }),
  component: Index,
});

const features = [
  { title: "Smart Email Generator", desc: "Draft polished emails by tone and audience.", icon: Mail, url: "/email", accent: "from-blue-500/10 to-indigo-500/10" },
  { title: "Meeting Notes Summarizer", desc: "Extract key points, actions, and deadlines.", icon: FileText, url: "/meeting", accent: "from-violet-500/10 to-fuchsia-500/10" },
  { title: "AI Task Planner", desc: "Prioritize and schedule your day intelligently.", icon: ListTodo, url: "/tasks", accent: "from-emerald-500/10 to-teal-500/10" },
  { title: "AI Research Assistant", desc: "Insights, summaries, and recommendations.", icon: Search, url: "/research", accent: "from-amber-500/10 to-orange-500/10" },
  { title: "AI Chatbot", desc: "Conversational assistant for any work task.", icon: MessageSquare, url: "/chat", accent: "from-rose-500/10 to-pink-500/10" },
];

function Index() {
  return (
    <AppShell title="Dashboard">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl border border-border bg-card p-8 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> AI Workplace Suite
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Automate your daily work with AI.
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Five specialized assistants for emails, meetings, planning, research, and conversation —
            all powered by structured prompts for clear, professional output.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link key={f.url} to={f.url} className="group">
              <Card className="h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-elegant)]">
                <CardHeader>
                  <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${f.accent} text-primary`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription>{f.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
                    Open <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
