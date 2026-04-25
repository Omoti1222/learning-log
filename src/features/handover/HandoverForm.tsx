import { useState } from "react";
import type { HandoverCard } from "../../types";

type Input = Omit<HandoverCard, "id">;
type AddResult = { ok: true } | { ok: false; error: string };

type Props = {
  onAddCard: (input: Input) => AddResult;
};

export function HandoverForm({ onAddCard }: Props) {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [notes, setNotes] = useState("");
  const [links, setLinks] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = onAddCard({ title, steps, notes, links });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setTitle("");
    setSteps("");
    setNotes("");
    setLinks("");
  }

  const inputClass =
    "border border-gray-300 rounded px-3 py-2 text-sm w-full";

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 max-w-[900px]">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="業務名"
        className={inputClass}
      />
      <textarea
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        placeholder="手順（例：1. データを集計する 2. テンプレートに貼り付ける）"
        rows={4}
        className={`${inputClass} resize-y`}
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="注意事項"
        rows={2}
        className={`${inputClass} resize-y`}
      />
      <input
        value={links}
        onChange={(e) => setLinks(e.target.value)}
        placeholder="関連URL・ファイルパス"
        className={inputClass}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 cursor-pointer w-fit"
      >
        追加
      </button>
      {error && <p className="text-red-500 text-sm m-0">{error}</p>}
    </form>
  );
}
