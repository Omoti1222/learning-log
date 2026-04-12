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
    <article style={{ border: "1px solid #ccc", padding: 10 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong style={{ flex: 1 }}>{c.title}</strong>
        <button type="button" onClick={handleCopy}>
          {copied ? "コピー済み✓" : "AIに聞く"}
        </button>
        <button type="button" onClick={onDelete}>
          削除
        </button>
      </div>

      {c.hypothesis && <div>仮説: {c.hypothesis}</div>}
      {c.success && <div>成功: {c.success}</div>}

      <div style={{ marginTop: 8 }}>{children}</div>
    </article>
  );
}
