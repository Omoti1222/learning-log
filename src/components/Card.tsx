import { useState } from "react";
import type { ReactNode } from "react";
import type { CardType } from "../types";
import { buildPrompt } from "../utils/buildPrompt";

type Props = {
  c: CardType;
  onDelete: () => void;
  children: ReactNode;
};

export function Card(props: Props) {
  const { c, onDelete, children } = props;
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const prompt = buildPrompt(c);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm">
      <div className="flex gap-2 items-center">
        <strong className="flex-1 text-sm">{c.title}</strong>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
          title="AIへのプロンプトをコピー"
        >
          {copied ? "✓" : "AI"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded hover:bg-red-50 cursor-pointer"
          title="削除"
        >
          ×
        </button>
      </div>

      {c.hypothesis && (
        <div className="text-xs text-gray-500 mt-1">仮説: {c.hypothesis}</div>
      )}
      {c.success && (
        <div className="text-xs text-gray-500 mt-1">成功: {c.success}</div>
      )}

      <div className="mt-2">{children}</div>
    </article>
  );
}
