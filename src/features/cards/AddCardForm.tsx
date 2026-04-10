import { useState } from "react";

type Input = {title: string; hypothesis: string; success: string};

type Props = {
  onAddCard: (input: Input) => boolean;
};

export function AddCardForm({onAddCard}: Props) {
  const [title, setTitle] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [success, setSuccess] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = onAddCard({title, hypothesis, success});
    if (!ok) return;

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
    </form>
  );
}

