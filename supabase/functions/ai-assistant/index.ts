import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPTS: Record<string, string> = {
  email: `You are an expert business email writer. Generate a polished email based on the user's brief.
Follow this exact structure:
Subject: <concise subject line>

<greeting>

<body — clear, well-paragraphed, matching the requested tone and audience>

<sign-off>

Rules:
- Match the requested tone (professional, friendly, persuasive, apologetic, etc.) exactly.
- Tailor vocabulary and formality to the audience.
- Keep it concise. No filler.
- Output the email only — no explanations.`,

  meeting: `You are a meeting analyst. Summarize the meeting transcript or notes the user provides.
Output in clean Markdown using EXACTLY these sections:

## Summary
2-4 sentence overview.

## Key Points
- Bullet points of main discussion items.

## Action Items
- [Owner] Action — Deadline (if mentioned, else "TBD")

## Decisions Made
- Bullet list of concrete decisions.

## Open Questions
- Items that need follow-up.

Be precise. Do not invent owners or deadlines that were not stated.`,

  tasks: `You are an AI productivity coach. Given a list of raw tasks, prioritize and schedule them.
Use the Eisenhower matrix and realistic time-blocking for a standard 8-hour workday.
Output in clean Markdown:

## Prioritized Plan
| Priority | Task | Category | Est. Time | Suggested Slot |
|----------|------|----------|-----------|----------------|

Categories: Urgent+Important / Important / Urgent / Low.
Suggested slots: e.g. "9:00–10:30".

## Focus Recommendations
- 2-4 short tips on sequencing, batching, or breaks.`,

  research: `You are a senior research analyst. Produce a structured briefing on the topic the user provides.
Output Markdown:

## Executive Summary
3-5 sentences.

## Key Insights
- 4-6 numbered insights, each 1-2 sentences.

## Trends & Data Points
- Concrete trends, stats, or examples (note when figures are illustrative).

## Recommendations
- 3-5 actionable recommendations.

## Further Reading
- Suggested topics or sources to explore.

Be objective and clearly mark uncertainty.`,

  chat: `You are a helpful, concise AI workplace productivity assistant. Help the user with work tasks: drafting messages, planning, brainstorming, summarizing, and answering questions. Be professional and to the point. Use Markdown formatting when helpful.`,
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { task, messages, input } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const systemPrompt = SYSTEM_PROMPTS[task] || SYSTEM_PROMPTS.chat;
    const finalMessages = messages?.length
      ? [{ role: "system", content: systemPrompt }, ...messages]
      : [
          { role: "system", content: systemPrompt },
          { role: "user", content: input ?? "" },
        ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: finalMessages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in Lovable workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});