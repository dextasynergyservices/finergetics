import type React from "react";
import { cn } from "@/lib/utils";

interface TiptapNode {
  type: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  text?: string;
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
}

interface RichTextRendererProps {
  content?: Record<string, unknown> | null;
  className?: string;
}

export function RichTextRenderer({
  content,
  className = "",
}: RichTextRendererProps) {
  if (!content || typeof content !== "object") {
    return null;
  }

  const doc = content as unknown as TiptapNode;
  if (!doc.content || !Array.isArray(doc.content)) {
    return null;
  }

  return (
    <div
      className={cn(
        "prose prose-slate max-w-none font-body",
        "prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-navy-950",
        "prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4",
        "prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3",
        "prose-p:text-slate-600 prose-p:text-base sm:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-5",
        "prose-strong:text-navy-950 prose-strong:font-bold",
        "prose-a:text-royal-600 prose-a:font-semibold hover:prose-a:text-royal-700 prose-a:underline",
        "prose-ul:my-5 prose-ul:list-disc prose-ul:pl-6 prose-li:text-slate-600 prose-li:mb-2",
        "prose-ol:my-5 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-slate-600 prose-li:mb-2",
        "prose-blockquote:border-l-4 prose-blockquote:border-royal-600 prose-blockquote:pl-5 prose-blockquote:italic prose-blockquote:text-slate-700 prose-blockquote:bg-sky-50/50 prose-blockquote:py-2 prose-blockquote:rounded-r-xl",
        className,
      )}
    >
      {doc.content.map((node, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Document AST nodes have no unique ID
        <RenderNode key={`ast-${index}`} node={node} />
      ))}
    </div>
  );
}

function RenderNode({ node }: { node: TiptapNode }): React.ReactNode {
  switch (node.type) {
    case "paragraph":
      return (
        <p>
          {node.content?.map((child, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Child nodes have no unique ID
            <RenderChild key={`child-${i}`} child={child} />
          )) || <br />}
        </p>
      );
    case "heading": {
      const level = (node.attrs?.level as number) || 2;
      const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
      return (
        <Tag>
          {node.content?.map((child, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Child nodes have no unique ID
            <RenderChild key={`child-${i}`} child={child} />
          ))}
        </Tag>
      );
    }
    case "bulletList":
      return (
        <ul>
          {node.content?.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: List item nodes have no unique ID
            <RenderNode key={`item-${i}`} node={item} />
          ))}
        </ul>
      );
    case "orderedList":
      return (
        <ol>
          {node.content?.map((item, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: List item nodes have no unique ID
            <RenderNode key={`item-${i}`} node={item} />
          ))}
        </ol>
      );
    case "listItem":
      return (
        <li>
          {node.content?.map((child, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: List item children have no unique ID
            <RenderChild key={`child-${i}`} child={child} />
          ))}
        </li>
      );
    case "blockquote":
      return (
        <blockquote>
          {node.content?.map((child, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Blockquote children have no unique ID
            <RenderNode key={`child-${i}`} node={child} />
          ))}
        </blockquote>
      );
    case "horizontalRule":
      return <hr className="my-8 border-silver-400/30" />;
    default:
      if (node.text) {
        return <RenderChild child={node} />;
      }
      return null;
  }
}

function RenderChild({ child }: { child: TiptapNode }): React.ReactNode {
  if (!child.text) return null;

  let element: React.ReactNode = child.text;

  if (child.marks && Array.isArray(child.marks)) {
    for (const mark of child.marks) {
      if (mark.type === "bold") {
        element = <strong>{element}</strong>;
      } else if (mark.type === "italic") {
        element = <em>{element}</em>;
      } else if (mark.type === "strike") {
        element = <del>{element}</del>;
      } else if (mark.type === "code") {
        element = (
          <code className="px-1.5 py-0.5 rounded bg-sky-100/70 text-royal-800 text-sm font-mono">
            {element}
          </code>
        );
      } else if (mark.type === "link") {
        const href = (mark.attrs?.href as string) || "#";
        const isExternal =
          href.startsWith("http://") || href.startsWith("https://");
        element = (
          <a
            href={href}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {element}
          </a>
        );
      }
    }
  }

  return element;
}
