import React from "react";
const { useState, useEffect, useRef } = React; // 🚀 Use this safe mapping instead
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

import clearMirrorData from "./clear-mirror-journal-data.json" with { type: "json" };
import innerMirrorData from "./inner-mirror-journal-data.json" with { type: "json" };

/* ── FONTS ── */
const FontLink = () => {
  useEffect(() => {
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap";
    document.head.appendChild(l);
  }, []);
  return null;
};

/* ── DESIGN TOKENS ── */
const T = {
  bg:       "#EDEAE3",
  card:     "#FFFFFF",
  muted:    "#F4F1EC",
  text:     "#1A1916",
  sec:      "#6B6A62",
  ter:      "#A5A49A",
  accent:   "#6A8C69",
  accentLt: "#EAF1E9",
  accentMd: "#A8C4A6",
  border:   "#E6E2D8",
  coral:    "#D4644A",
  amber:    "#C8941A",
  teal:     "#4A8C8A",
  blue:     "#5B7FA6",
};

const MOODS = {
  Calm:       { bg: "#EAF1E9", c: "#3E7040" },
  Balanced:   { bg: "#EAF1E9", c: "#3E7040" },
  Restless:   { bg: "#FDEAE6", c: "#C04A30" },
  Aversion:   { bg: "#FDF3DC", c: "#9A6010" },
  Reflective: { bg: "#E5EDF5", c: "#3A5F86" },
  Anxious:    { bg: "#FDEAE6", c: "#C04A30" },
  Hopeful:    { bg: "#EAF1E9", c: "#3E7040" },
};

/* ── SYSTEM PROMPT ── */
const SYSTEM_PROMPT = `You are a deeply wise, warm, and psychologically mature reflection guide. You analyze journal entries through timeless contemplative and psychological wisdom.

Return ONLY a valid JSON object with these exact fields:
{
  "emotionalState": "2-4 warm, honest sentences about the emotional landscape",
  "coreMentalPattern": "2-4 sentences on the dominant pattern of mind",
  "deeperRoot": "2-4 sentences on what lies beneath the surface",
  "repeatedTendencies": "2-4 sentences — if first entry, note patterns will grow clearer over time",
  "strengthsNoticed": "2-4 sentences on genuine wholesome qualities visible",
  "sufferingCreated": "2-4 sentences on where the person may be creating friction for self or others",
  "practicalReflection": "2-4 sentences offering a grounded, doable suggestion",
  "gentleQuestion": "One clear, open question for self-observation",
  "closingInsight": "One short, memorable sentence of quiet wisdom",
  "mood": "exactly one of: Calm, Restless, Balanced, Aversion, Reflective, Anxious, Hopeful",
  "tags": ["2-3 short theme labels, max 3 words each"],
  "inquiry": "The gentleQuestion rephrased as a standalone question"
}

Critical rules:
- No religious terms: no Buddha, Buddhism, Pali, dharma, karma, nirvana, sangha
- Do not flatter, diagnose, shame, or preach
- Be honest but warm — truth delivered with care
- Return ONLY the JSON, no preamble, no markdown fences`;

/* ── SAMPLE DATA ── */
const DEMO = [
  {
    id: "demo_1", title: "Morning Restlessness",
    text: "Felt a strong urge to check emails before even getting out of bed. The mind was racing toward future tasks, creating a subtle tension in my chest. I noticed I was already mentally composing responses to messages I hadn't read yet.",
    createdAt: "2023-10-24T07:30:00Z", mood: "Restless", wordCount: 124,
    tags: ["Future Security", "Attachment"],
    inquiry: "If there were no 'right' way to feel right now, what would you let yourself admit?",
    analysis: {
      emotionalState: "Your emotional landscape is characterized by a high degree of conscientiousness that has slipped into quiet over-analysis. While clarity is your goal, the mind is currently using 'knowing' as a shield against 'feeling'.",
      coreMentalPattern: "There is a recurring tendency to treat the future as a problem to be solved rather than a reality to be met. The mind reaches forward compulsively, as if stillness itself were dangerous.",
      deeperRoot: "Beneath this restlessness lies a subtle belief that your worth depends on productivity. Rest feels like falling behind, and the body is carrying that mathematics quietly.",
      repeatedTendencies: "This is not the first time this pattern has appeared. The compulsive morning reach, the chest tightness — these are familiar visitors that deserve your attention.",
      strengthsNoticed: "Despite the restlessness, you noticed it. You named it without catastrophizing. That space between impulse and observation is quietly growing.",
      sufferingCreated: "The drive for perfection in your routines is creating a 'performance' mindset even during rest. You are treating self-care as another task to be optimized.",
      practicalReflection: "Tomorrow morning, try lying still for two full minutes before reaching for any device. Notice what arises — not to fix it, but to simply see it.",
      gentleQuestion: "If there were no 'right' way to feel right now, what would you let yourself admit?",
      closingInsight: "The mind that races toward tomorrow is always arriving late to today.",
      mood: "Restless", tags: ["Future Security", "Attachment"],
      inquiry: "If there were no 'right' way to feel right now, what would you let yourself admit?"
    }
  },
  {
    id: "demo_2", title: "Quiet Evening",
    text: "A calm walk in the park. Observed the changing leaves without the usual need to document or share it. A rare moment of just being present without an audience.",
    createdAt: "2023-10-22T18:00:00Z", mood: "Balanced", wordCount: 89,
    tags: ["Reduced Attachment", "Presence"],
    inquiry: "What part of this situation are you trying to control that is actually outside of your reach?",
    analysis: {
      emotionalState: "A genuine moment of rest — not manufactured calm, but the kind that arrives when the mind stops performing and simply receives what is there.",
      coreMentalPattern: "For once, the habitual need to capture, share, and archive an experience was absent. This is more significant than it might appear.",
      deeperRoot: "The relief you felt suggests how much energy usually goes into translating experience into content. Without that layer, the walk was simply richer.",
      repeatedTendencies: "Compare this to earlier entries where every moment of beauty was immediately followed by the impulse to share it. Something is shifting.",
      strengthsNoticed: "Real presence. Real seeing. This is a genuine sign of reduced attachment to external validation. Treasure it.",
      sufferingCreated: "Very little today. The suffering was mostly in the background — a faint guilt about 'not being productive enough'.",
      practicalReflection: "Try to create one such window each day — a small experience you consciously choose not to record or share with anyone.",
      gentleQuestion: "What part of this situation are you trying to control that is actually outside of your reach?",
      closingInsight: "Some moments lose their depth the instant we try to preserve them.",
      mood: "Balanced", tags: ["Reduced Attachment", "Presence"],
      inquiry: "What part of this situation are you trying to control that is actually outside of your reach?"
    }
  },
  {
    id: "demo_3", title: "Work Conflict",
    text: "Felt defensive during the team meeting when my proposal was questioned. I noticed a recurring pattern of equating my ideas with my identity. The criticism felt personal even when I knew logically it wasn't.",
    createdAt: "2023-10-19T14:00:00Z", mood: "Aversion", wordCount: 156,
    tags: ["Honest Reflection", "Ego Patterns"],
    inquiry: "Is this thought based on a current fact, or a memory of a past disappointment?",
    analysis: {
      emotionalState: "Defensiveness in the meeting points to a tight fusion between your ideas and your sense of self. When the proposal was challenged, it was experienced as a personal threat.",
      coreMentalPattern: "The mind has built an identity around being the person with good ideas. When that identity is questioned, it triggers the same mechanisms as physical danger.",
      deeperRoot: "This likely traces back to experiences where your value was tied to your intellectual contribution or performance.",
      repeatedTendencies: "This pattern has appeared in your relationship entries too — the same sting when a suggestion is dismissed by someone close to you.",
      strengthsNoticed: "You caught it mid-meeting. You noticed the defensive reaction rising before acting on it fully. That awareness is the beginning of real change.",
      sufferingCreated: "By defending the idea so vigorously, you may have missed the genuine insight your colleague was actually offering.",
      practicalReflection: "In your next meeting, practice holding your ideas with an open hand rather than a clenched fist. The best ideas survive examination.",
      gentleQuestion: "Is this thought based on a current fact, or a memory of a past disappointment?",
      closingInsight: "The strength of a mind is not in how firmly it holds its ideas, but in how gracefully it lets them evolve.",
      mood: "Aversion", tags: ["Honest Reflection", "Ego Patterns"],
      inquiry: "Is this thought based on a current fact, or a memory of a past disappointment?"
    }
  },
  {
    id: "demo_4", title: "Social Exhaustion",
    text: "After the party, I felt completely drained. Realized I was 'performing' to meet expected social standards rather than being authentic. It was as if I was watching myself from the outside all evening.",
    createdAt: "2023-09-30T22:00:00Z", mood: "Reflective", wordCount: 98,
    tags: ["New Insight", "Authenticity"],
    inquiry: "Who would you be in this moment if you stopped believing you were 'behind' in life?",
    analysis: {
      emotionalState: "The exhaustion after social performance is the body's honest accounting. It costs real energy to be someone slightly other than yourself for extended periods.",
      coreMentalPattern: "Social performance mode activates when the mind believes the authentic self is not acceptable or interesting enough as it is.",
      deeperRoot: "There is an old fear here — that if people saw you without the performance, they would find you ordinary, or worse, disappointing.",
      repeatedTendencies: "This pattern appears repeatedly around social gatherings. The joy is real, but so is the cost of the performance that accompanies it.",
      strengthsNoticed: "You noticed the performance while it was happening — not just in retrospect. That in-the-moment awareness is a meaningful development.",
      sufferingCreated: "The people who would love the real you are being denied access to them. That is a form of loneliness even in a room full of people.",
      practicalReflection: "In your next social gathering, choose one moment to say something slightly more honest than your usual performance would allow.",
      gentleQuestion: "Who would you be in this moment if you stopped believing you were 'behind' in life?",
      closingInsight: "The most tiring role is always the one you were never meant to play.",
      mood: "Reflective", tags: ["New Insight", "Authenticity"],
      inquiry: "Who would you be in this moment if you stopped believing you were 'behind' in life?"
    }
  }
];

const CHART_DATA = [
  { w: "W1",  clarity: 32, equanimity: 28 },
  { w: "W2",  clarity: 36, equanimity: 31 },
  { w: "W3",  clarity: 34, equanimity: 34 },
  { w: "W4",  clarity: 40, equanimity: 37 },
  { w: "W5",  clarity: 43, equanimity: 40 },
  { w: "W6",  clarity: 46, equanimity: 43 },
  { w: "W7",  clarity: 49, equanimity: 46 },
  { w: "W8",  clarity: 51, equanimity: 49 },
  { w: "W9",  clarity: 53, equanimity: 52 },
  { w: "W10", clarity: 57, equanimity: 54 },
  { w: "W11", clarity: 60, equanimity: 57 },
  { w: "W12", clarity: 65, equanimity: 62 },
];

const PATTERNS = [
  { name: "The Perfectionist's Shield", desc: "Using high standards to avoid the messiness of raw emotion.", dot: T.amber },
  { name: "Future-Tense Living", desc: "A tendency to solve tomorrow's problems to feel safe today.", dot: T.blue },
  { name: "The Quiet Observer", desc: "Increasing space between a difficult thought and your reaction.", dot: T.accent },
];

const PROMPTS = [
  { icon: "?", text: "Try to describe the physical sensation of your current emotion." },
  { icon: "🧘", text: "What is one thing you are holding onto that you could let go of today?" },
  { icon: "🌱", text: "What would the most patient version of yourself do right now?" },
  { icon: "🪞", text: "What are you avoiding seeing clearly about this situation?" },
];

const SETTINGS_SECTIONS = [
  {
    label: "Privacy & Protection",
    items: [
      { icon: "🔐", bg: "#E8EFF0", name: "App Lock", desc: "Secure your journal with Biometrics" },
      { icon: "🙈", bg: "#F5E8E8", name: "Privacy Mode", desc: "Hide sensitive text in entry previews" },
      { icon: "📤", bg: "#E8EFF0", name: "Export Data", desc: "Download all your journals as PDF o…" },
    ]
  },
  {
    label: "Journaling Experience",
    items: [
      { icon: "🔔", bg: "#EFF0E8", name: "Gentle Reminders", desc: "Daily nudges for mindful reflection" },
      { icon: "🎨", bg: "#F5EEE0", name: "Appearance", desc: "Current theme: Serene Sage" },
    ]
  },
  {
    label: "Account & Long-term Memory",
    items: [
      { icon: "☁️", bg: "#E8EFF0", name: "Cloud Sync", desc: "Encrypted backup across your devices…" },
      { icon: "🔄", bg: "#F5E8E8", name: "Reset Patterns", desc: "Clear the AI's long-term memory" },
    ]
  }
];

/* ── UTILS ── */
const fmtLong  = iso => new Date(iso).toLocaleDateString("en-US",{ month:"short",day:"numeric",year:"numeric"}).toUpperCase();
const fmtShort = iso => new Date(iso).toLocaleDateString("en-US",{ month:"short",day:"numeric"}).toUpperCase();
const fmtMonth = iso => new Date(iso).toLocaleDateString("en-US",{ month:"long",year:"numeric"});
const words    = t => t.trim().split(/\s+/).filter(Boolean).length;

function groupBy(arr, fn) {
  const m = {};
  arr.forEach(x => { const k = fn(x); (m[k] = m[k] || []).push(x); });
  return m;
}

/* ── SHARED ── */
const Divider = ({ style }) => <div style={{ height: 1, background: T.border, ...style }} />;

function MoodPill({ mood }) {
  const m = MOODS[mood] || MOODS.Calm;
  return <span style={{ padding:"3px 11px", borderRadius:20, fontSize:11, fontWeight:600, background:m.bg, color:m.c, letterSpacing:"0.02em" }}>{mood}</span>;
}

function SecLabel({ children, style }) {
  return <p style={{ fontSize:10, fontWeight:600, letterSpacing:"0.13em", textTransform:"uppercase", color:T.ter, margin:"28px 0 12px", ...style }}>{children}</p>;
}

function Card({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{ background:T.card, borderRadius:16, padding:"18px 20px", boxShadow:"0 1px 10px rgba(0,0,0,0.055)", ...style }}>
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ONBOARDING
══════════════════════════════════════════════ */
const SLIDES = [
  {
    title: "A Mirror for Your Mind",
    body: "Inner Mirror helps you see the recurring patterns of your thoughts and emotions through a lens of timeless wisdom.",
  },
  {
    title: "Understand Your Patterns",
    body: "With every entry, the mirror sharpens. Hidden tendencies, quiet fears, and genuine strengths become visible over time.",
  },
  {
    title: "Begin Your Journey",
    body: "Write freely, without self-editing. The more honest your entry, the clearer the reflection you will receive.",
  },
];

function OnboardingIllustration({ slide }) {
  const sizes = [[280,200],[260,180],[270,190]];
  const [outer, inner] = sizes[slide];
  const outerC = ["#E3DEDA","#DDD9D1","#E0DCD4"][slide];
  const innerC = ["#D2CEC6","#C9C5BD","#CCCAC0"][slide];
  return (
    <div style={{ width:outer, height:outer, borderRadius:"50%", background:outerC, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:inner, height:inner, borderRadius:"50%", background:innerC }} />
    </div>
  );
}

function OnboardingPage({ onDone }) {
  const [slide, setSlide] = useState(0);
  const s = SLIDES[slide];
  const isLast = slide === SLIDES.length - 1;
  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column", padding:"0 28px", fontFamily:"'DM Sans',sans-serif" }}>
      <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:52 }}>
        <button onClick={onDone} style={{ background:"none", border:"none", cursor:"pointer", fontSize:15, color:T.accent, fontFamily:"inherit", fontWeight:500 }}>Skip</button>
      </div>

      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", marginTop:16 }}>
        <OnboardingIllustration slide={slide} />
      </div>

      <div style={{ paddingBottom:12 }}>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:T.text, margin:"0 0 14px", lineHeight:1.25 }}>{s.title}</h1>
        <p style={{ fontSize:16, color:T.sec, lineHeight:1.7, margin:0 }}>{s.body}</p>

        <div style={{ display:"flex", gap:8, margin:"28px 0 28px", alignItems:"center" }}>
          {SLIDES.map((_,i) => (
            <div key={i} style={{ width:i===slide?24:8, height:8, borderRadius:4, background:i===slide?T.accent:T.border, transition:"all 0.3s ease" }} />
          ))}
        </div>

        <button
          onClick={() => isLast ? onDone() : setSlide(s => s+1)}
          style={{ width:"100%", padding:"18px 0", borderRadius:50, background:T.accent, border:"none", color:"white", fontSize:16, fontWeight:500, cursor:"pointer", fontFamily:"inherit", marginBottom:16, transition:"opacity 0.15s" }}
        >
          {isLast ? "Get Started" : "Continue"}
        </button>

        <p style={{ textAlign:"center", fontSize:13, color:T.ter, marginBottom:40, display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          🔒 Your journals are private and encrypted.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   JOURNAL ENTRY
══════════════════════════════════════════════ */
function JournalPage({ onAnalyze, onBack }) {
  const [title, setBody_title] = useState("");
  const [body, setBody]   = useState("");
  const [busy, setBusy]   = useState(false);
  const [msg,  setMsg]    = useState("");
  const [err,  setErr]    = useState("");
  const wc = words(body);
  const mood = wc < 30 ? "Calm" : wc < 80 ? "Reflective" : "Calm";
  const today = new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}).toUpperCase();

  async function analyze() {
    if (body.trim().length < 30) { setErr("Write a little more — the more you share, the deeper the reflection."); return; }
    setErr(""); setBusy(true);
    const msgs = ["Reading your words carefully…","Looking beneath the surface…","Tracing the threads of your mind…","Composing your reflection…"];
    let mi = 0; setMsg(msgs[0]);
    const iv = setInterval(() => { mi=(mi+1)%msgs.length; setMsg(msgs[mi]); }, 2200);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json", "anthropic-version":"2023-06-01", "anthropic-dangerous-direct-browser-access":"true" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:4096, system:SYSTEM_PROMPT,
          messages:[{ role:"user", content:`Journal Title: ${title||"Untitled"}\n\nJournal Entry:\n${body}` }]
        })
      });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      const raw  = data.content?.map(i=>i.text||"").join("").trim();
      const m    = raw.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("Could not parse response. Please try again.");
      const analysis = JSON.parse(m[0]);
      const entry = {
        id:`entry_${Date.now()}`, title:title||"Untitled Reflection", text:body,
        createdAt:new Date().toISOString(), mood:analysis.mood||mood, wordCount:wc,
        analysis, tags:analysis.tags||[], inquiry:analysis.inquiry||analysis.gentleQuestion
      };
      try { await window.storage.set(`entry:${entry.id}`, JSON.stringify(entry)); } catch{}
      onAnalyze(entry);
    } catch(e) {
      setErr(e.message||"Something went wrong. Please try again.");
    } finally { clearInterval(iv); setBusy(false); setMsg(""); }
  }

  return (
    <div style={{ minHeight:"100vh", background:"#F5F3EE", fontFamily:"'DM Sans',sans-serif", display:"flex", flexDirection:"column" }}>
      {/* Topbar */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 20px 8px" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, color:T.sec, lineHeight:1, padding:"0 4px" }}>‹</button>
        <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:14, color:T.accent, fontFamily:"inherit", fontWeight:500 }}>Save Draft</button>
        <button onClick={analyze} disabled={busy} style={{ padding:"9px 18px", background:T.accent, color:"white", border:"none", borderRadius:24, fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:6, opacity:busy?0.7:1 }}>
          ✦ Deep Analysis
        </button>
      </div>

      {/* Date */}
      <p style={{ textAlign:"center", fontSize:11, fontWeight:600, letterSpacing:"0.1em", color:T.sec, margin:"6px 0 20px" }}>{today}</p>

      {/* Write area */}
      <div style={{ flex:1, padding:"0 24px", overflow:"auto" }}>
        {busy ? (
          <div style={{ textAlign:"center", padding:"80px 0", color:T.sec, fontSize:15, fontStyle:"italic", lineHeight:2 }}>{msg}</div>
        ) : (
          <>
            <input
              value={title} onChange={e=>setBody_title(e.target.value)}
              placeholder="Title your reflection..."
              style={{ width:"100%", border:"none", background:"none", fontSize:22, fontFamily:"'Playfair Display',serif", color:T.text, outline:"none", marginBottom:24, fontStyle:title?"normal":"italic", fontWeight:600 }}
            />
            <textarea
              value={body} onChange={e=>{ setBody(e.target.value); setErr(""); }}
              placeholder="What is moving through your mind right now..."
              style={{ width:"100%", minHeight:280, border:"none", background:"none", fontSize:16, fontFamily:"'DM Sans',sans-serif", color:T.sec, outline:"none", resize:"none", lineHeight:1.85 }}
            />
            {err && <p style={{ fontSize:13, color:T.coral, marginTop:8 }}>{err}</p>}
          </>
        )}
      </div>

      {/* Prompts */}
      {!busy && (
        <div style={{ padding:"0 20px 100px" }}>
          <SecLabel style={{ margin:"16px 0 12px" }}>Gentle Prompts</SecLabel>
          {PROMPTS.slice(0,2).map((p,i) => (
            <div key={i} onClick={()=>setBody(b=>b+(b?"\n\n":"")+p.text+" ")}
              style={{ display:"flex", gap:12, alignItems:"flex-start", padding:"14px 16px", background:"#EDEAE4", borderRadius:12, marginBottom:10, cursor:"pointer" }}>
              <span style={{ width:28, height:28, borderRadius:"50%", background:T.accentLt, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:T.accent, flexShrink:0, fontWeight:700 }}>{p.icon}</span>
              <p style={{ margin:0, fontSize:14, color:T.sec, lineHeight:1.65 }}>{p.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Statusbar */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(245,243,238,0.96)", borderTop:`1px solid ${T.border}`, padding:"12px 24px 26px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <span style={{ fontSize:12, color:T.ter, display:"flex", alignItems:"center", gap:5 }}>≡ {wc} words</span>
          <span style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:T.accent }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:T.accent, display:"inline-block" }} />{mood}
          </span>
        </div>
        <div style={{ display:"flex", gap:20, fontSize:18 }}>
          <span style={{ cursor:"pointer" }}>🎤</span>
          <span style={{ cursor:"pointer" }}>🖼️</span>
          <span style={{ cursor:"pointer" }}>🔒</span>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   INSIGHT ANALYSIS — "The Mind's Mirror"
══════════════════════════════════════════════ */
function InsightPage({ entry, onBack }) {
  const a = entry.analysis;
  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans',sans-serif", paddingBottom:80 }}>
      {/* Back bar */}
      <div style={{ padding:"18px 20px 0", display:"flex", alignItems:"center" }}>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:5, fontSize:14, color:T.sec, fontFamily:"inherit" }}>
          ‹ Back
        </button>
      </div>

      <div style={{ padding:"10px 22px 0" }}>
        <p style={{ fontSize:11, color:T.ter, letterSpacing:"0.1em", margin:"0 0 6px" }}>{fmtShort(entry.createdAt)}</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:700, color:T.text, margin:"0 0 12px", lineHeight:1.15 }}>The Mind's<br/>Mirror</h1>
        <div style={{ width:40, height:3, background:T.accent, borderRadius:2, marginBottom:28 }} />

        {/* Current State */}
        <Card style={{ marginBottom:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontSize:12, color:T.accent, display:"flex", alignItems:"center", gap:6, fontWeight:500 }}>
              <span style={{ fontSize:10 }}>✓</span> Current State
            </span>
            <span style={{ fontSize:15, color:T.ter }}>✦</span>
          </div>
          <p style={{ fontSize:15, color:T.text, lineHeight:1.78, margin:"0 0 18px" }}>{a.emotionalState}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
            {(entry.tags||[]).map((t,i)=>(
              <span key={i} style={{ padding:"4px 14px", border:`1px solid ${T.border}`, borderRadius:20, fontSize:12, color:T.sec }}>{t}</span>
            ))}
          </div>
        </Card>

        {/* Recurring Tendencies */}
        <SecLabel>Recurring Tendencies</SecLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:24 }}>
          {(entry.tags||["Focus","Source"]).slice(0,2).map((tag,i)=>(
            <div key={i} style={{ background:T.card, borderRadius:12, padding:"14px 16px", borderLeft:`3px solid ${T.accent}`, boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
              <p style={{ fontSize:10, color:T.ter, margin:"0 0 5px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{i===0?"Focus":"Source"}</p>
              <p style={{ fontSize:14, fontWeight:600, color:T.text, margin:0, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{tag}</p>
            </div>
          ))}
        </div>

        {/* Detail rows */}
        <Card style={{ marginBottom:22 }}>
          {[
            { icon:"📍", label:"Hidden Sources of Stress", key:"sufferingCreated",   color:T.teal  },
            { icon:"❤️", label:"Blind Spots",              key:"deeperRoot",         color:T.coral },
            { icon:"↗", label:"Signs of Growth",          key:"strengthsNoticed",   color:T.accent },
          ].map((item,i,arr)=>(
            <div key={i}>
              <p style={{ fontSize:13, fontWeight:600, color:T.text, margin:"0 0 7px", display:"flex", alignItems:"center", gap:7 }}>
                <span>{item.icon}</span>{item.label}
              </p>
              <p style={{ fontSize:14, color:T.sec, lineHeight:1.72, margin:0 }}>{a[item.key]}</p>
              {i<arr.length-1 && <div style={{ height:1, background:T.border, margin:"18px 0" }} />}
            </div>
          ))}
        </Card>

        {/* Question card */}
        <Card style={{ textAlign:"center", marginBottom:32 }}>
          <p style={{ fontSize:32, color:T.ter, margin:"0 0 10px", lineHeight:1 }}>?</p>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontStyle:"italic", color:T.text, lineHeight:1.55, margin:"0 0 22px" }}>{a.gentleQuestion}</p>
          <button style={{ padding:"12px 36px", background:T.accent, color:"white", border:"none", borderRadius:24, fontSize:14, cursor:"pointer", fontFamily:"inherit", fontWeight:500 }}>
            Record Reflection
          </button>
        </Card>

        <p style={{ textAlign:"center", fontStyle:"italic", fontSize:13, color:T.ter, lineHeight:1.75, marginBottom:24 }}>{a.closingInsight}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MIND HISTORY
══════════════════════════════════════════════ */
function HistoryPage({ entries, onSelect, onNewEntry }) {
  const groups = groupBy(entries, e => fmtMonth(e.createdAt));
  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans',sans-serif", paddingBottom:90 }}>
      <div style={{ padding:"52px 20px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:4 }}>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:700, color:T.text, margin:0 }}>Mind History</h1>
            <p style={{ fontSize:13, color:T.sec, margin:"5px 0 0" }}>Tracking your inner landscape</p>
          </div>
          <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:T.sec, marginTop:4 }}>⚙</button>
        </div>

        {/* Weekly pattern card */}
        <div style={{ background:T.card, borderRadius:14, padding:"14px 16px", display:"flex", gap:14, alignItems:"center", margin:"22px 0 4px", boxShadow:"0 1px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize:20, color:T.accent }}>↗</span>
          <div>
            <p style={{ fontSize:10, color:T.ter, textTransform:"uppercase", letterSpacing:"0.1em", margin:"0 0 3px", fontWeight:600 }}>Weekly Pattern</p>
            <p style={{ fontSize:13, color:T.text, margin:0, lineHeight:1.5 }}>You've shown a 15% increase in 'Patience' compared to last month.</p>
          </div>
        </div>

        {Object.entries(groups).map(([month, list]) => (
          <div key={month}>
            <p style={{ fontSize:13, color:T.ter, textAlign:"center", margin:"24px 0 14px", fontWeight:500 }}>{month}</p>
            {list.map(entry => (
              <div key={entry.id} onClick={()=>onSelect(entry)} style={{ background:T.card, borderRadius:16, padding:"18px 18px 14px", marginBottom:14, boxShadow:"0 1px 9px rgba(0,0,0,0.055)", cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                  <div>
                    <p style={{ fontSize:10, color:T.ter, margin:"0 0 5px", letterSpacing:"0.07em" }}>{fmtShort(entry.createdAt)}</p>
                    <h3 style={{ fontSize:16, fontWeight:600, color:T.text, margin:0 }}>{entry.title}</h3>
                  </div>
                  <MoodPill mood={entry.mood} />
                </div>
                <p style={{ fontSize:13, color:T.sec, margin:"8px 0 14px", lineHeight:1.65, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                  {entry.text}
                </p>
                <Divider />
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingTop:10 }}>
                  <span style={{ fontSize:12, color:T.accent, display:"flex", alignItems:"center", gap:5 }}>
                    ↗ {(entry.tags||["New Insight"])[0]}
                  </span>
                  <span style={{ fontSize:12, color:T.sec }}>→ Read Insight</span>
                </div>
              </div>
            ))}
          </div>
        ))}

        <p style={{ textAlign:"center", fontSize:13, color:T.ter, margin:"28px 0 16px" }}>Your journey began here</p>
      </div>

      {/* FAB */}
      <button onClick={onNewEntry} style={{ position:"fixed", bottom:90, right:20, padding:"14px 20px", background:T.accent, color:"white", border:"none", borderRadius:28, fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"'DM Sans',sans-serif", boxShadow:"0 4px 18px rgba(0,0,0,0.16)", display:"flex", alignItems:"center", gap:7 }}>
        + New Entry
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SELF-INQUIRY ARCHIVE
══════════════════════════════════════════════ */
const dotColor = mood => ({ Calm:"#6A8C69",Balanced:"#6A8C69",Restless:"#D4644A",Aversion:"#C8941A",Reflective:"#5B7FA6",Anxious:"#D4644A",Hopeful:"#6A8C69" }[mood]||T.ter);

function SelfInquiryPage({ entries }) {
  const [q, setQ] = useState("");
  const items = entries.filter(e=>e.inquiry).map(e=>({
    id:e.id, date:e.createdAt, question:e.inquiry, tag:(e.tags||[])[0]||"Reflection", mood:e.mood
  }));
  const filtered = items.filter(i=>!q||i.question.toLowerCase().includes(q.toLowerCase()));
  const groups = {};
  filtered.forEach(i=>{
    const diff = (Date.now()-new Date(i.date).getTime())/86400000;
    const d = new Date(i.date);
    const key = diff<7?"Recent Reflections":diff<35?"Earlier in "+d.toLocaleString("default",{month:"long"}):d.toLocaleString("default",{month:"long"});
    (groups[key]=groups[key]||[]).push(i);
  });

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans',sans-serif", paddingBottom:90 }}>
      <div style={{ padding:"52px 20px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ fontSize:10, color:T.ter, letterSpacing:"0.13em", textTransform:"uppercase", margin:"0 0 5px", fontWeight:600 }}>Journey of Questions</p>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:30, fontWeight:700, color:T.text, margin:0 }}>Self-Inquiry</h1>
          </div>
          <button style={{ background:"none", border:"none", cursor:"pointer", fontSize:18, color:T.sec, marginTop:4 }}>☰</button>
        </div>

        {/* Search */}
        <div style={{ position:"relative", margin:"20px 0" }}>
          <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:T.ter, fontSize:14 }}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search past inquiries..."
            style={{ width:"100%", padding:"12px 14px 12px 40px", borderRadius:12, border:`1px solid ${T.border}`, background:T.card, fontSize:14, color:T.text, outline:"none", fontFamily:"inherit", boxSizing:"border-box" }}
          />
        </div>

        {Object.entries(groups).map(([group, list])=>(
          <div key={group}>
            <p style={{ fontSize:12, color:T.ter, textAlign:"center", margin:"22px 0 12px" }}>{group}</p>
            {list.map(item=>(
              <Card key={item.id} style={{ marginBottom:14, cursor:"pointer" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                  <p style={{ fontSize:11, color:T.ter, margin:0, letterSpacing:"0.07em" }}>{fmtLong(item.date)}</p>
                  <span style={{ width:9, height:9, borderRadius:"50%", background:dotColor(item.mood), display:"inline-block", marginTop:2 }} />
                </div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:16, color:T.text, lineHeight:1.62, margin:"0 0 16px" }}>{item.question}</p>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <span style={{ fontSize:13, color:T.sec }}>📍</span>
                  <span style={{ fontSize:12, color:T.sec }}>{item.tag}</span>
                </div>
              </Card>
            ))}
          </div>
        ))}

        {filtered.length===0 && (
          <p style={{ textAlign:"center", color:T.ter, fontSize:14, padding:"60px 0", fontStyle:"italic" }}>No inquiries yet. Write your first journal entry.</p>
        )}

        <p style={{ textAlign:"center", fontStyle:"italic", fontSize:12, color:T.ter, margin:"28px 0", lineHeight:1.75 }}>
          The quality of your life is determined<br/>by the quality of your questions.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   GROWTH TRENDS
══════════════════════════════════════════════ */
function GrowthTrendsPage() {
  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans',sans-serif", paddingBottom:90 }}>
      <div style={{ padding:"52px 20px 0" }}>
        <p style={{ fontSize:10, color:T.ter, letterSpacing:"0.13em", textTransform:"uppercase", margin:"0 0 5px", fontWeight:600 }}>Long-term View</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, fontWeight:700, color:T.text, margin:"0 0 10px" }}>Growth Trends</h1>
        <p style={{ fontSize:14, color:T.sec, margin:"0 0 28px", lineHeight:1.65 }}>Observing the shifting tides of your mind over the last 90 days.</p>

        {/* Stat cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:24 }}>
          {[
            { label:"Awareness",  val:"High", delta:"+14%", up:true,  icon:"👁️" },
            { label:"Reactivity", val:"Low",  delta:"-22%", up:false, icon:"📍" },
          ].map((s,i)=>(
            <Card key={i} style={{ padding:"16px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <p style={{ fontSize:11, color:T.ter, margin:0 }}>{s.label}</p>
                <span style={{ fontSize:16 }}>{s.icon}</span>
              </div>
              <p style={{ fontSize:26, fontWeight:700, color:T.text, margin:"0 0 4px" }}>{s.val}</p>
              <p style={{ fontSize:12, color:s.up?T.accent:T.teal, margin:0, fontWeight:500 }}>{s.up?"↑":"↓"} {s.delta}</p>
            </Card>
          ))}
        </div>

        {/* Chart */}
        <Card style={{ padding:"20px 14px 18px", marginBottom:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, padding:"0 4px" }}>
            <div>
              <p style={{ fontSize:16, fontWeight:600, color:T.text, margin:0 }}>Emotional Balance</p>
              <p style={{ fontSize:12, color:T.ter, margin:"3px 0 0" }}>Last 12 weeks</p>
            </div>
            <span style={{ fontSize:14, color:T.ter }}>ⓘ</span>
          </div>
          <div style={{ height:155 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CHART_DATA} margin={{ top:4, right:4, bottom:0, left:-28 }}>
                <XAxis dataKey="w" tick={{ fontSize:10, fill:T.ter }} axisLine={false} tickLine={false} interval={1} />
                <YAxis hide />
                <Tooltip contentStyle={{ fontSize:11, borderRadius:8, border:`1px solid ${T.border}` }} />
                <Line type="monotone" dataKey="clarity"   stroke={T.accent} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="equanimity" stroke={T.accentMd} strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display:"flex", gap:22, marginTop:12, padding:"0 4px" }}>
            {[["Clarity",T.accent],["Equanimity",T.accentMd]].map(([l,c])=>(
              <span key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:T.sec }}>
                <span style={{ width:8, height:8, borderRadius:"50%", background:c }} />{l}
              </span>
            ))}
          </div>
        </Card>

        {/* Patterns */}
        <SecLabel>Recurring Mental Patterns</SecLabel>
        {PATTERNS.map((p,i)=>(
          <Card key={i} style={{ marginBottom:12, padding:"16px 18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                <span style={{ width:9, height:9, borderRadius:"50%", background:p.dot, marginTop:5, flexShrink:0 }} />
                <div>
                  <p style={{ fontSize:14, fontWeight:600, color:T.text, margin:"0 0 5px" }}>{p.name}</p>
                  <p style={{ fontSize:13, color:T.sec, margin:0, lineHeight:1.5 }}>{p.desc}</p>
                </div>
              </div>
              <span style={{ color:T.ter, marginLeft:10, flexShrink:0, fontSize:16 }}>›</span>
            </div>
          </Card>
        ))}

        {/* Shift banner */}
        <Card style={{ marginTop:8, marginBottom:32 }}>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <span style={{ fontSize:20, marginTop:2 }}>✦</span>
            <div>
              <p style={{ fontSize:14, fontWeight:600, color:T.text, margin:"0 0 9px" }}>Significant Shift Detected</p>
              <p style={{ fontSize:14, color:T.sec, lineHeight:1.72, margin:0 }}>
                You are moving from 'fixing' your emotions to 'hosting' them. This shift from resistance to hospitality is the root of lasting peace.
              </p>
            </div>
          </div>
        </Card>

        <p style={{ textAlign:"center", fontStyle:"italic", fontSize:12, color:T.ter, margin:"0 0 24px", lineHeight:1.75 }}>
          Progress is not a straight line,<br/>but a widening circle of awareness.
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   SETTINGS & PRIVACY
══════════════════════════════════════════════ */
function SettingsPage() {
  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'DM Sans',sans-serif", paddingBottom:90 }}>
      <div style={{ padding:"52px 20px 0" }}>
        <p style={{ fontSize:10, color:T.ter, letterSpacing:"0.13em", textTransform:"uppercase", margin:"0 0 6px", fontWeight:600 }}>Inner Mirror</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:34, fontWeight:700, color:T.text, margin:"0 0 12px", lineHeight:1.2 }}>Settings &<br/>Privacy</h1>
        <div style={{ width:40, height:3, background:T.accent, borderRadius:2, marginBottom:32 }} />

        {SETTINGS_SECTIONS.map(sec=>(
          <div key={sec.label} style={{ marginBottom:28 }}>
            <SecLabel style={{ margin:"0 0 12px" }}>{sec.label}</SecLabel>
            <div style={{ background:T.card, borderRadius:16, overflow:"hidden", boxShadow:"0 1px 8px rgba(0,0,0,0.06)" }}>
              {sec.items.map((item,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:14, padding:"16px 18px", borderBottom:i<sec.items.length-1?`1px solid ${T.border}`:"none", cursor:"pointer" }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:item.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, flexShrink:0 }}>
                    {item.icon}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:15, fontWeight:500, color:T.text, margin:"0 0 2px" }}>{item.name}</p>
                    <p style={{ fontSize:13, color:T.sec, margin:0 }}>{item.desc}</p>
                  </div>
                  <span style={{ color:T.ter, fontSize:16 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Delete zone */}
        <div style={{ background:"#FDF0EE", borderRadius:16, padding:"20px 18px", marginBottom:36, display:"flex", justifyContent:"flex-end", alignItems:"center" }}>
          <button style={{ padding:"10px 26px", background:T.coral, color:"white", border:"none", borderRadius:8, fontSize:14, fontWeight:500, cursor:"pointer", fontFamily:"inherit" }}>Delete</button>
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ width:32, height:3, background:T.border, borderRadius:2, margin:"0 auto 16px" }} />
          <p style={{ fontSize:13, color:T.sec, margin:"0 0 4px" }}>Inner Mirror v2.4.0</p>
          <p style={{ fontSize:13, color:T.sec, margin:"0 0 14px" }}>Your data is end-to-end encrypted.</p>
          <p style={{ fontSize:12, fontStyle:"italic", color:T.ter, lineHeight:1.75, margin:0 }}>
            The unexamined life is a heavy burden.<br/>Walk lightly.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   BOTTOM NAV
══════════════════════════════════════════════ */
const NAV = [
  { id:"history",  label:"History",  e:"📖" },
  { id:"inquiry",  label:"Inquiry",  e:"💬" },
  { id:"journal",  label:"Write",    e:"✏️" },
  { id:"trends",   label:"Trends",   e:"📈" },
 /* { id:"settings", label:"Settings", e:"⚙️" },*/
];

function BottomNav({ page, setPage }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(255,255,255,0.96)", backdropFilter:"blur(12px)", borderTop:`1px solid ${T.border}`, display:"flex", padding:"10px 0 22px", zIndex:200 }}>
      {NAV.map(tab=>(
        <button key={tab.id} onClick={()=>setPage(tab.id)} style={{ flex:1, background:"none", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, fontSize:10, color:page===tab.id?T.accent:T.ter, fontWeight:page===tab.id?600:400, letterSpacing:"0.04em", fontFamily:"'DM Sans',sans-serif", padding:"4px 0" }}>
          <span style={{ fontSize:tab.id==="journal"?22:18 }}>{tab.e}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════ */
export default function InnerMirror() {
  const [onboarded,    setOnboarded]    = useState(null);
  const [page,         setPage]         = useState("history");
  const [entries,      setEntries]      = useState(DEMO);
  const [selectedEntry,setSelectedEntry]= useState(null);
  const [showInsight,  setShowInsight]  = useState(false);
  const [showJournal,  setShowJournal]  = useState(false);

  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get("onboarded"); setOnboarded(!!r); }
      catch { setOnboarded(true); }
    })();
    (async () => {
      try {
        const result = await window.storage.list("entry:");
        if (!result?.keys?.length) return;
        const loaded = [];
        for (const key of result.keys) {
          const r = await window.storage.get(key);
          if (r) loaded.push(JSON.parse(r.value));
        }
        if (loaded.length) {
          loaded.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
          setEntries(loaded);
        }
      } catch {}
    })();
  }, []);

  async function doneOnboarding() {
    try { await window.storage.set("onboarded","1"); } catch {}
    setOnboarded(true);
  }

  function onAnalyze(entry) {
    setEntries(prev => {
      const exists = prev.find(e=>e.id===entry.id);
      const fresh = exists ? prev.map(e=>e.id===entry.id?entry:e) : [entry, ...prev.filter(e=>!e.id.startsWith("demo_"))];
      return fresh.sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
    });
    setSelectedEntry(entry);
    setShowJournal(false);
    setShowInsight(true);
    setPage("history");
  }

  if (onboarded === null) return <div style={{ minHeight:"100vh", background:T.bg }} />;
  if (!onboarded) return <><FontLink/><OnboardingPage onDone={doneOnboarding}/></>;

  if (showJournal) return <><FontLink/><JournalPage onAnalyze={onAnalyze} onBack={()=>setShowJournal(false)}/></>;

  if (showInsight && selectedEntry) return (
    <>
      <FontLink/>
      <InsightPage entry={selectedEntry} onBack={()=>setShowInsight(false)}/>
    </>
  );

  return (
    <>
      <FontLink/>
      {page==="history"  && <HistoryPage entries={entries} onSelect={e=>{setSelectedEntry(e);setShowInsight(true);}} onNewEntry={()=>setShowJournal(true)}/>}
      {page==="inquiry"  && <SelfInquiryPage entries={entries}/>}
      {page==="journal"  && <JournalPage onAnalyze={onAnalyze} onBack={()=>setPage("history")}/>}
      {page==="trends"   && <GrowthTrendsPage entries={entries}/>}
      {page==="settings" && <SettingsPage/>}
      {page!=="journal"  && <BottomNav page={page} setPage={setPage}/>}
    </>
  );
}

import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<InnerMirror />); 

