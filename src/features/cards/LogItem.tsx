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
      <button
        type="button"
        onClick={handleCopy}
        className="text-xs px-2 py-0.5 border border-slate-200 text-slate-400 rounded hover:bg-slate-50 cursor-pointer shrink-0"
        title="タイトルとコメントをコピー"
      >
        {copied ? "✓" : "コピー"}
      </button>
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
