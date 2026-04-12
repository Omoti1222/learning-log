import { useState } from "react";

type Input = { title: string; hypothesis?: string; success?: string };

type AddCardResult = { ok: true } | { ok: false; error: string };

type Props = {
  onAddCard: (input: Input) => AddCardResult;
};

export function AddCardForm({ onAddCard }: Props) {
  const [mode, setMode] = useState<"simple" | "detail">("simple");
  const [title, setTitle] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input =
      mode === "simple" ? { title } : { title, hypothesis, success };

    const result = onAddCard(input);
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
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => setMode("simple")}
          style={{ fontWeight: mode === "simple" ? "bold" : "normal" }}
        >
          やること
        </button>
        <button
          type="button"
          onClick={() => setMode("detail")}
          style={{ fontWeight: mode === "detail" ? "bold" : "normal" }}
        >
          試してみる
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
      />

      {mode === "detail" && (
        <>
          <input
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="仮説（〇〇すれば△△になるはず）"
          />
          <input
            value={success}
            onChange={(e) => setSuccess(e.target.value)}
            placeholder="成功条件（具体的・測定可能な形で）"
          />
        </>
      )}

      <button type="submit">追加</button>
      {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
    </form>
  );
}
