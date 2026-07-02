import type { ReactNode } from "react";
import type { CardType } from "../types";

type Props = {
  c: CardType;
  onDelete: () => void;
  children: ReactNode;
};

export function Card(props: Props) {
  const { c, onDelete, children } = props;

  return (
    <article className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
      <div className="flex gap-2 items-center">
        <strong className="flex-1 text-sm text-slate-800">{c.title}</strong>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs px-2 py-0.5 border border-slate-200 text-slate-400 rounded hover:bg-red-50 hover:text-red-400 hover:border-red-200 cursor-pointer"
          title="削除"
        >
          ×
        </button>
      </div>

      {c.hypothesis && (
        <div className="text-xs text-slate-400 mt-1">仮説: {c.hypothesis}</div>
      )}
      {c.success && (
        <div className="text-xs text-slate-400 mt-1">成功条件: {c.success}</div>
      )}

      <div className="mt-2">{children}</div>
    </article>
  );
}
