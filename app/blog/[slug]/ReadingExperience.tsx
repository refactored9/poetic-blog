"use client";

import { useMemo, useState } from "react";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

interface ReadingExperienceProps {
  content: string;
  isHtml: boolean;
  headings: Heading[];
}

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";
}

export default function ReadingExperience({ content, isHtml, headings }: ReadingExperienceProps) {
  const [fontScale, setFontScale] = useState(100);
  const [lineMode, setLineMode] = useState<"normal" | "airy">("normal");
  const [focusMode, setFocusMode] = useState(false);
  const [showTocMobile, setShowTocMobile] = useState(false);

  const textStyle = useMemo(
    () => ({
      fontSize: `${fontScale / 100}rem`,
      lineHeight: lineMode === "airy" ? 2.08 : 1.9,
    }),
    [fontScale, lineMode]
  );

  const plainBlocks = useMemo(() => {
    if (isHtml) return [] as Array<{ type: "h2" | "h3" | "p"; text: string; id?: string }>;

    return content
      .split("\n\n")
      .map((block) => block.trim())
      .filter(Boolean)
      .map((block, idx) => {
        if (block.startsWith("## ")) {
          const text = block.replace("## ", "").trim();
          return { type: "h2" as const, text, id: `${slugify(text)}-${idx}` };
        }
        if (block.startsWith("### ")) {
          const text = block.replace("### ", "").trim();
          return { type: "h3" as const, text, id: `${slugify(text)}-${idx}` };
        }
        return { type: "p" as const, text: block };
      });
  }, [content, isHtml]);

  return (
    <div className="space-y-5">
      <div className="sticky top-20 z-20 rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-3 shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center gap-2">
          <p className="section-label mr-1">Reading tools</p>

          <button
            onClick={() => setFontScale((value) => Math.max(92, value - 4))}
            className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-[var(--muted)] hover:border-[var(--accent-light)] hover:text-[var(--foreground)]"
          >
            A-
          </button>
          <button
            onClick={() => setFontScale((value) => Math.min(116, value + 4))}
            className="rounded-xl border border-[var(--border)] px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-[var(--muted)] hover:border-[var(--accent-light)] hover:text-[var(--foreground)]"
          >
            A+
          </button>

          <button
            onClick={() => setLineMode((mode) => (mode === "normal" ? "airy" : "normal"))}
            className={`rounded-xl border px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] ${
              lineMode === "airy"
                ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent-dark)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent-light)] hover:text-[var(--foreground)]"
            }`}
          >
            Airy
          </button>

          <button
            onClick={() => setFocusMode((value) => !value)}
            className={`rounded-xl border px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] ${
              focusMode
                ? "border-[var(--accent)] bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] text-[var(--accent-dark)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent-light)] hover:text-[var(--foreground)]"
            }`}
          >
            Focus
          </button>

          {headings.length > 0 && (
            <button
              onClick={() => setShowTocMobile((value) => !value)}
              className="ml-auto rounded-xl border border-[var(--border)] px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-[var(--muted)] hover:border-[var(--accent-light)] hover:text-[var(--foreground)] lg:hidden"
            >
              Contents
            </button>
          )}
        </div>

        {showTocMobile && headings.length > 0 && (
          <div className="mt-3 space-y-1 border-t border-[var(--border)] pt-3 lg:hidden">
            {headings.map((heading) => (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={() => setShowTocMobile(false)}
                className={`block rounded-lg px-2 py-1.5 text-sm text-[var(--muted)] transition-colors hover:bg-[var(--background-alt)] hover:text-[var(--foreground)] ${
                  heading.level === 3 ? "ml-3 text-[13px]" : ""
                }`}
              >
                {heading.text}
              </a>
            ))}
          </div>
        )}
      </div>

      <div
        className={`rounded-[24px] border border-[var(--border)] p-6 md:p-10 ${
          focusMode
            ? "bg-[var(--background-card)] shadow-[0_12px_26px_rgba(0,0,0,0.08)]"
            : "bg-[color-mix(in_srgb,var(--background-card)_82%,transparent)]"
        }`}
      >
        {isHtml ? (
          <div
            style={textStyle}
            className="
              [&_p]:mb-6 [&_p]:text-[var(--foreground-soft)]
              [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:scroll-mt-28 [&_h2]:font-serif [&_h2]:text-[2rem] [&_h2]:font-semibold [&_h2]:leading-[1.06] [&_h2]:tracking-[0.01em]
              [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:scroll-mt-28 [&_h3]:font-serif [&_h3]:text-[1.5rem] [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:tracking-[0.01em]
              [&_ul]:mb-6 [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2
              [&_ol]:mb-6 [&_ol]:ml-5 [&_ol]:list-decimal [&_ol]:space-y-2
              [&_li]:text-[var(--foreground-soft)]
              [&_blockquote]:my-8 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[var(--accent)] [&_blockquote]:pl-5 [&_blockquote]:font-serif [&_blockquote]:text-[1.2em] [&_blockquote]:text-[var(--foreground-soft)]
              [&_a]:text-[var(--accent-dark)] [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-[var(--foreground)]
              [&_img]:my-8 [&_img]:w-full [&_img]:rounded-[18px]
              [&_p:first-of-type::first-letter]:mr-1.5 [&_p:first-of-type::first-letter]:mt-1 [&_p:first-of-type::first-letter]:float-left [&_p:first-of-type::first-letter]:font-serif [&_p:first-of-type::first-letter]:text-6xl [&_p:first-of-type::first-letter]:font-semibold [&_p:first-of-type::first-letter]:leading-[0.85]
            "
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <div style={textStyle} className="space-y-6 text-[var(--foreground-soft)]">
            {plainBlocks.map((block, index) => {
              if (block.type === "h2") {
                return (
                  <h2 key={index} id={block.id} className="scroll-mt-28 font-serif text-[2rem] font-semibold leading-[1.06] tracking-[0.01em] text-[var(--foreground)]">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "h3") {
                return (
                  <h3 key={index} id={block.id} className="scroll-mt-28 font-serif text-[1.5rem] font-semibold leading-tight tracking-[0.01em] text-[var(--foreground)]">
                    {block.text}
                  </h3>
                );
              }
              return <p key={index}>{block.text}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
