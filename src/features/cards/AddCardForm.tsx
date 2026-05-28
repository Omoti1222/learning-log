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

  const tabBase = "px-3 py-1 text-sm rounded border cursor-pointer transition-colors";
  const tabActive = "border-slate-700 text-slate-700 font-semibold bg-white";
  const tabInactive = "border-slate-200 text-slate-400 bg-white hover:bg-slate-50";
  const inputCls = "border border-slate-200 rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-slate-400";

  return (
    <form onSubmit={handleSubmit} className="grid gap-2 max-w-[900px]">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("simple")}
          className={`${tabBase} ${mode === "simple" ? tabActive : tabInactive}`}
        >
          やること
        </button>
        <button
          type="button"
          onClick={() => setMode("detail")}
          className={`${tabBase} ${mode === "detail" ? tabActive : tabInactive}`}
        >
          試してみる
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タイトル"
        className={inputCls}
      />

      {mode === "detail" && (
        <>
          <input
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="仮説（〇〇すれば△△になるはず）"
            className={inputCls}
          />
          <input
            value={success}
            onChange={(e) => setSuccess(e.target.value)}
            placeholder="成功条件（具体的・測定可能な形で）"
            className={inputCls}
          />
        </>
      )}

      <button
        type="submit"
        className="px-4 py-1.5 bg-slate-700 text-white text-sm rounded hover:bg-slate-800 cursor-pointer w-fit transition-colors"
      >
        追加
      </button>
      {error && <p className="text-red-400 text-sm m-0">{error}</p>}
    </form>
  );
}
