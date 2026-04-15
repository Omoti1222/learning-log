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

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 900 }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="業務名"
      />
      <textarea
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        placeholder="手順（例：1. データを集計する 2. テンプレートに貼り付ける）"
        rows={4}
      />
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="注意事項"
        rows={2}
      />
      <input
        value={links}
        onChange={(e) => setLinks(e.target.value)}
        placeholder="関連URL・ファイルパス"
      />
      <button type="submit">追加</button>
      {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
    </form>
  );
}
