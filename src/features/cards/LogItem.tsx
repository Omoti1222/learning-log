import { useState } from "react";
import type { CardType } from "../../types";

type Props = {
  c: CardType;
  selected: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export function LogItem({ c, selected, onToggle, onDelete }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = c.comment ? `${c.title}\n${c.comment}` : c.title;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const time = c.completedAt
    ? new Date(c.completedAt).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <li className="text-sm flex items-start gap-2">
      <input
        type="checkbox"
        checked={selected}
        onChange={onToggle}
        className="mt-1 cursor-pointer accent-slate-600"
      />
      <div className="min-w-0 flex-1">
        <span className="text-gray-400 text-xs mr-2">{time}</span>
        <strong>{c.learning || c.title}</strong>
        {c.learning && (
          <span className="text-gray-500 text-xs"> ({c.title})</span>
        )}
        {c.comment && (
          <div className="text-gray-500 text-xs mt-0.5">
            コメント: {c.comment}
          </div>
        )}
      </div>
      <div className="relative group shrink-0">
        <button
          type="button"
          onClick={handleCopy}
          aria-label="copy"
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded cursor-pointer"
        >
          {copied ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
        <span className="pointer-events-none absolute bottom-full right-0 mb-1 whitespace-nowrap rounded bg-slate-800 text-white text-[10px] px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {copied ? "copied!" : "copy"}
        </span>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="text-xs px-2 py-0.5 border border-slate-200 text-slate-400 rounded hover:bg-red-50 hover:text-red-400 hover:border-red-200 cursor-pointer shrink-0"
        title="削除"
      >
        ×
      </button>
    </li>
  );
}
