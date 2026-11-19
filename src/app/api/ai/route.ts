import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { action, title, category, slideCopy, type } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || "";

    if (apiKey && apiKey.startsWith("AQ.")) {
      // Valid Gemini API key format
      try {
        let systemPrompt = "";
        let userPrompt = "";

        if (action === "generate_slides") {
          systemPrompt = `You are the lead content architect for Rewrite Minds (@rewrite_minds). You write high-signal, psychologically sharp, counterintuitive short-form carousels and essays. Avoid generic corporate speak. Write in a clear, punchy, visceral voice. Focus on cognitive models, breaking mental conditioning, epistemic humility, and behavioral change.`;
          userPrompt = `Write an 8-slide carousel breakdown for: "${title}".
Category: ${category || "Mindset & Philosophy"}.
Format as:
Slide 1 (Cover / Hook):
Slide 2 (The Hidden Trap):
Slide 3 (The Mental Reframe):
Slide 4 (Core Mechanism):
Slide 5 (The Friction / Contrast):
Slide 6 (Actionable Rule):
Slide 7 (Practical Example):
Slide 8 (Takeaway / Call to Reflection):`;
        } else if (action === "repurpose") {
          systemPrompt = `You are a social content repurposing expert. Convert carousel slide copy into a high-retention 60-second Instagram Reel/TikTok video script (with visual hooks and audio pacing) AND a 6-part viral X (Twitter) thread.`;
          userPrompt = `Repurpose this content:
Title: "${title}"
Original Slide Copy:
${slideCopy || "No slide copy provided."}

Output format:
=== 🎬 60-SECOND REEL SCRIPT ===
[Hook 0-3s]:
[Visual B-Roll Note]:
[Core Tension 3-20s]:
[The Pivot 20-40s]:
[Actionable Rule 40-55s]:
[Outro / Save Hook 55-60s]:

=== 𝕏 VIRAL THREAD ===
1/6:
2/6:
3/6:
4/6:
5/6:
6/6:`;
        } else {
          // Hooks
          systemPrompt = `You write high-CTR, curiosity-driven opening hooks that challenge common wisdom without sounding like cheap clickbait.`;
          userPrompt = `Generate 5 viral opening hook angles for a piece titled: "${title}".`;
        }

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: `${systemPrompt}\n\nTask: ${userPrompt}` }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
              },
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const generatedText =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({ success: true, text: generatedText });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini direct inference failed, using fallback:", geminiErr);
      }
    }

    // High quality intelligent template fallback
    if (action === "generate_slides") {
      const fallback = `Slide 1 (Cover):
${title}
(Why everything you were taught about this is inverted)

Slide 2 (The Default Trap):
Most people approach this with the default mental model:
• React to immediate stimulus
• Prioritize short-term comfort over compounding
• Confuse busyness with actual leverage

Slide 3 (The Core Reframe):
The shift happens when you recognize the feedback loop.
What feels productive in the first 10 minutes is often an avoidance mechanism for the harder decision.

Slide 4 (The Mechanism):
1. Identify the hidden constraint
2. Remove friction before adding effort
3. Audit the decision cost over 90 days

Slide 5 (The Friction):
Why this is hard: Your environment is optimized for compliance, not autonomy.
Expect discomfort in week 1. That friction is evidence of neuroplasticity, not failure.

Slide 6 (The Operating Rule):
"If the decision isn't an emphatic yes under calm conditions, it's a default no."

Slide 7 (Daily Practice):
Audit one reaction tomorrow morning:
Did you choose it intentionally, or did an old cognitive script choose it for you?

Slide 8 (Save & Reflect):
Save this breakdown for your weekly review.
Share your thought in the comments: What is your primary bottleneck right now?`;

      return NextResponse.json({ success: true, text: fallback, isFallback: true });
    }

    if (action === "repurpose") {
      const fallback = `=== 🎬 60-SECOND REEL SCRIPT ===
[Hook 0-3s]: (Direct to camera, no smile): "Stop trying to fix this the hard way."
[Visual]: Cut to B-roll of notebook / focused deep work.
[Core Tension 3-20s]: "90% of people burn out because they treat a structural problem like a motivation problem."
[The Pivot 20-40s]: "Here is what happens when you rewrite the underlying model instead: ${title}."
[Actionable Rule 40-55s]: "Step 1: Stop consuming before you create. Step 2: Establish the 20-minute friction barrier."
[Outro 55-60s]: "Save this so you don't default back to your old pattern tomorrow."

=== 𝕏 VIRAL THREAD ===
1/6: Most people don't fail because they lack discipline. They fail because their mental models are 5 years outdated. Here is how to think about ${title}: 🧵

2/6: The conventional advice tells you to double down on willpower. But willpower is a depleting resource. Systems and environmental design win every time.

3/6: Notice where your attention leaks. If you spend the first hour of your day reacting to other people's priorities, you've already lost autonomy.

4/6: The 3-layer test:
- Is this adding leverage?
- Does this compound over 90 days?
- Would I choose this if no one was watching?

5/6: One actionable switch you can implement before noon today: Remove the friction trigger.

6/6: If you enjoyed this breakdown, follow @rewrite_minds for weekly cognitive reframes and systems design.`;

      return NextResponse.json({ success: true, text: fallback, isFallback: true });
    }

    // Default Hooks
    const hooks = [
      `1. "Why smart people keep making this obvious mistake (and how to break the cycle)"`,
      `2. "The uncomfortable truth about ${title}"`,
      `3. "If you only change one mental habit this month, make it this one"`,
      `4. "Most advice on this gets the causality backwards."`,
      `5. "3 quiet behaviors that separate high-agency thinkers from the crowd."`,
    ].join("\n");

    return NextResponse.json({ success: true, text: hooks, isFallback: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process AI action" },
      { status: 500 }
    );
  }
}
