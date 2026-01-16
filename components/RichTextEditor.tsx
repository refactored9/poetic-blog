"use client";

import { useRef, useCallback, useEffect } from "react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync value to editor
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternalChange.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  }, [handleInput]);

  const isActive = useCallback((command: string) => {
    return document.queryCommandState(command);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.metaKey || e.ctrlKey) {
      switch (e.key.toLowerCase()) {
        case "b":
          e.preventDefault();
          execCommand("bold");
          break;
        case "i":
          e.preventDefault();
          execCommand("italic");
          break;
        case "u":
          e.preventDefault();
          execCommand("underline");
          break;
      }
    }
  };

  const ToolbarButton = ({
    command,
    icon,
    title,
    value: cmdValue
  }: {
    command: string;
    icon: React.ReactNode;
    title: string;
    value?: string;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        execCommand(command, cmdValue);
      }}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded hover:bg-[var(--background-alt)] transition-colors ${
        isActive(command) ? "bg-[var(--background-alt)] text-[var(--accent)]" : "text-[var(--foreground)]"
      }`}
    >
      {icon}
    </button>
  );

  const ToolbarDivider = () => (
    <div className="w-px h-5 bg-[var(--border)] mx-1" />
  );

  return (
    <div className="border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--background-card)]">
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-2 border-b border-[var(--border)] bg-[var(--background-alt)] flex-wrap">
        {/* Text Style */}
        <ToolbarButton
          command="bold"
          title="Bold (Ctrl+B)"
          icon={<span className="font-bold text-sm">B</span>}
        />
        <ToolbarButton
          command="italic"
          title="Italic (Ctrl+I)"
          icon={<span className="italic text-sm">I</span>}
        />
        <ToolbarButton
          command="underline"
          title="Underline (Ctrl+U)"
          icon={<span className="underline text-sm">U</span>}
        />
        <ToolbarButton
          command="strikeThrough"
          title="Strikethrough"
          icon={<span className="line-through text-sm">S</span>}
        />

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          command="formatBlock"
          value="h2"
          title="Heading 2"
          icon={
            <span className="text-xs font-bold">H2</span>
          }
        />
        <ToolbarButton
          command="formatBlock"
          value="h3"
          title="Heading 3"
          icon={
            <span className="text-xs font-bold">H3</span>
          }
        />
        <ToolbarButton
          command="formatBlock"
          value="p"
          title="Paragraph"
          icon={
            <span className="text-xs">P</span>
          }
        />

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          command="insertUnorderedList"
          title="Bullet List"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              <circle cx="1" cy="6" r="1" fill="currentColor" />
              <circle cx="1" cy="12" r="1" fill="currentColor" />
              <circle cx="1" cy="18" r="1" fill="currentColor" />
            </svg>
          }
        />
        <ToolbarButton
          command="insertOrderedList"
          title="Numbered List"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 6h13M7 12h13M7 18h13" />
              <text x="1" y="8" fontSize="6" fill="currentColor">1</text>
              <text x="1" y="14" fontSize="6" fill="currentColor">2</text>
              <text x="1" y="20" fontSize="6" fill="currentColor">3</text>
            </svg>
          }
        />

        <ToolbarDivider />

        {/* Block */}
        <ToolbarButton
          command="formatBlock"
          value="blockquote"
          title="Quote"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4-4-4z" />
            </svg>
          }
        />

        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarButton
          command="justifyLeft"
          title="Align Left"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
            </svg>
          }
        />
        <ToolbarButton
          command="justifyCenter"
          title="Align Center"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M5 18h14" />
            </svg>
          }
        />

        <ToolbarDivider />

        {/* Clear */}
        <ToolbarButton
          command="removeFormat"
          title="Clear Formatting"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          }
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        className="min-h-[300px] p-4 outline-none prose prose-lg max-w-none
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-[var(--muted-soft)] [&:empty]:before:pointer-events-none
          [&_h2]:text-2xl [&_h2]:font-serif [&_h2]:font-medium [&_h2]:mt-6 [&_h2]:mb-3
          [&_h3]:text-xl [&_h3]:font-serif [&_h3]:font-medium [&_h3]:mt-4 [&_h3]:mb-2
          [&_p]:mb-4 [&_p]:leading-relaxed
          [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
          [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
          [&_li]:mb-1
          [&_blockquote]:border-l-4 [&_blockquote]:border-[var(--accent)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--muted)] [&_blockquote]:my-4
          [&_strong]:font-semibold
          [&_em]:italic
          [&_u]:underline
          [&_s]:line-through
          [&_a]:text-[var(--accent)] [&_a]:underline
        "
        suppressContentEditableWarning
      />
    </div>
  );
}
