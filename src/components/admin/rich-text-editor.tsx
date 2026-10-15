"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Undo,
} from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
  label?: string;
  value?: Record<string, unknown> | null;
  onChange: (doc: Record<string, unknown>) => void;
  placeholder?: string;
}

export function RichTextEditor({
  label = "Content Body",
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
    ],
    content: value || {
      type: "doc",
      content: [
        {
          type: "paragraph",
        },
      ],
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose max-w-none p-5 min-h-[220px] focus:outline-none text-ink-900 leading-relaxed font-body",
      },
    },
    immediatelyRender: false,
  });

  // Sync external value updates if needed
  useEffect(() => {
    if (
      editor &&
      value &&
      JSON.stringify(editor.getJSON()) !== JSON.stringify(value)
    ) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded-3xl bg-white border border-silver-400/25 overflow-hidden shadow-xs space-y-0">
      {label && (
        <div className="px-5 py-3 border-b border-silver-400/15 bg-sky-50/50 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            {label}
          </span>
          <span className="text-[10px] text-slate-400 uppercase font-semibold">
            Tiptap Structured JSON
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="p-2 border-b border-silver-400/15 bg-white flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            "p-2 rounded-xl text-xs transition-colors cursor-pointer",
            editor.isActive("bold")
              ? "bg-royal-600 text-white font-bold"
              : "text-slate-600 hover:bg-sky-50",
          )}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            "p-2 rounded-xl text-xs transition-colors cursor-pointer",
            editor.isActive("italic")
              ? "bg-royal-600 text-white"
              : "text-slate-600 hover:bg-sky-50",
          )}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-silver-400/30 mx-1" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={cn(
            "p-2 rounded-xl text-xs transition-colors cursor-pointer",
            editor.isActive("heading", { level: 2 })
              ? "bg-royal-600 text-white"
              : "text-slate-600 hover:bg-sky-50",
          )}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={cn(
            "p-2 rounded-xl text-xs transition-colors cursor-pointer",
            editor.isActive("heading", { level: 3 })
              ? "bg-royal-600 text-white"
              : "text-slate-600 hover:bg-sky-50",
          )}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-silver-400/30 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={cn(
            "p-2 rounded-xl text-xs transition-colors cursor-pointer",
            editor.isActive("bulletList")
              ? "bg-royal-600 text-white"
              : "text-slate-600 hover:bg-sky-50",
          )}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={cn(
            "p-2 rounded-xl text-xs transition-colors cursor-pointer",
            editor.isActive("orderedList")
              ? "bg-royal-600 text-white"
              : "text-slate-600 hover:bg-sky-50",
          )}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={cn(
            "p-2 rounded-xl text-xs transition-colors cursor-pointer",
            editor.isActive("blockquote")
              ? "bg-royal-600 text-white"
              : "text-slate-600 hover:bg-sky-50",
          )}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-silver-400/30 mx-1 ml-auto" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-xl text-xs text-slate-400 hover:text-ink-900 disabled:opacity-40 transition-colors cursor-pointer"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-xl text-xs text-slate-400 hover:text-ink-900 disabled:opacity-40 transition-colors cursor-pointer"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
