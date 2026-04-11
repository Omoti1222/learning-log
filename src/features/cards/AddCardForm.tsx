import { useState } from "react";

type Input = {title: string; hypothesis: string; success: string};

type AddCardResult = { ok: true } | { ok: false; error: string };

type Props = {
  onAddCard: (input: Input) => AddCardResult;
};

export function AddCardForm({onAddCard}: Props) {
  const [title, setTitle] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = onAddCard({title, hypothesis, success});
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError("");
    setTitle("");
    setHypothesis("");
    setSuccess("");
  }
  
  return (
    <form
    onSubmit={handleSubmit}
    style={{ display: "grid", gap: 8, maxWidth: 900 }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        />
      <input
        value={hypothesis}
        onChange={(e) => setHypothesis(e.target.value)}
        placeholder="仮説(予想)"
        />
      <input
        value={success}
        onChange={(e) => setSuccess(e.target.value)}
        placeholder="成功条件"
        />
      <button type="submit">追加</button>
      {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
    </form>
  );
}

