---
name: Natural copy
description: >-
  Write copy that reads as if a person wrote it. Use whenever drafting, rewriting, or
  reviewing writing meant for other people to read: web pages, emails, social posts, blog
  posts, newsletters, product descriptions, decks, scripts, bios, job ads, reports,
  proposals, and anything else that will be published or sent. Not for code comments, commit
  messages, or replies to the person you're working with. Follows the project's own brand
  voice where one exists; this skill adds the habits that keep copy from sounding
  machine-written.
---

# Natural copy

You are writing words that other people will read: published, sent, or presented. Two jobs, in order:

1. **Sound like the brand.** Look for a brand, voice or style guide in the project (a brand or voice skill, a `STYLE.md`, a brand-guidelines file, notes in `CLAUDE.md`). If one exists, it wins on tone, vocabulary, spelling and house style. This skill sits underneath it and never overrides it.
2. **Sound like a person.** Whatever the voice, avoid the habits below that make copy read as AI-generated. This is the part this skill is really for.

## Defaults (when the project says nothing)

- Plain English. Short words over long ones, concrete over abstract.
- American English spelling and punctuation, unless the project or the person asks otherwise.
- Confident and direct. Say the thing; don't announce that you are about to say it.
- No em dashes (—). Use a comma, split into two sentences, or occasionally a semicolon or parentheses.

Before: "The tool is fast — faster than doing it by hand — and free."
After: "The tool is fast, faster than doing it by hand, and free."

## The watch-list

AI-written copy leans on a handful of rhetorical moves. Each is fine once; in density they make everything sound the same. These have budgets, not bans, and a budget is a ceiling, not a target: the best number is usually zero, and hitting the budget every time is its own tell. They come out automatically while drafting, so the budget is enforced by the self-edit pass at the end, not by good intentions. Every entry shows the fix, because "don't" on its own isn't useful.

### 1. Lists of three

"The meeting notes, the formatting, the third rewrite of the same paragraph." Budget: at most one per section, and never in two consecutive sentences. Fix: cut one to a pair or a single item, or let one item carry the weight.

Before: "You say what you want, in your own words, and ask follow-up questions when the first answer isn't right. No code, no manual, no settings to fiddle with."
After: "You say what you want, in your own words, and ask follow-up questions when the first answer isn't right. No code and no manual."

### 2. The reversal

"It's not X, it's Y", and its cousins "isn't just X", "X, not Y", "the real X is Y". Budget: one per piece. Fix: state the Y directly and drop the X.

Before: "This isn't about saving time. It's about getting your evenings back."
After: "You get your evenings back."

### 3. "Quietly"

As in "fails quietly", "quietly breaks", "quietly brilliant". Check every use. Fix: say what actually happens.

Before: "The export quietly drops any rows with missing dates."
After: "The export drops any rows with missing dates, and doesn't tell you."

### 4. Over-bolding

Bold phrases scattered through paragraphs to signpost the "key" idea. Budget: bold only for things a reader scans for (a label, a warning, a name they need to find again). Never bold for emphasis inside running prose. Fix: if the sentence needs the emphasis, rewrite so the important words land at the end.

Before: "Our support team replies within one business day, and **most questions are answered on the first reply**."
After: "Most questions are answered on the first reply, and you'll always hear back within one business day."

### 5. Asking a question and answering it

"Why does this matter? Because…" / "The catch? There isn't one." Budget: once per piece, and only if the answer is a genuine surprise. Most pieces need none. Fix: turn the question into a statement.

Before: "So what does that mean for you? It means fewer forms."
After: "For you, that means fewer forms."

## The self-edit pass (required, silent)

After drafting, re-read the copy once for the list above and nothing else. Count the triads, reversals and self-answered questions; search for "quietly", bold markers and em dashes; rewrite anything over budget.

Then look again at what's left. For each remaining one, ask what it's doing there. Some have a real job: a product with exactly three features earns a list of three; a self-answered question can be useful in SEO copy. If it's doing a job like that, keep it. If it's only there out of habit, use the plain version. Being within budget isn't a reason on its own.

Then deliver the clean version. Don't narrate what you fixed unless asked.

Patterns to scan for: "…, …, and …" shapes; "not … but", "isn't … it's"; "?" followed by a one-line answer; `**` in markdown; "—".

This is a living list. When the person flags a new tic, add it here with a budget and a before/after.

## When asked to break a rule

Don't silently comply and don't silently substitute. Refuse that one detail with a one-sentence reason and offer the alternative:

"I've left the em dashes out, they tend to read as AI-written. Here's the version with commas instead."

If they insist after hearing the reason, do as they ask. The skill guides; it doesn't overrule people.
