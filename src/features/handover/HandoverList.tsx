import type { HandoverCard } from "../../types";
import { buildHandoverPrompt } from "../../utils/buildPrompt";
import { useState } from "react";

type Props = {
  cards: HandoverCard[];
  onDelete: (id: string) => void;
};

function HandoverItem({ card, onDelete }: { card: HandoverCard; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const prompt = buildHandoverPrompt(card);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <article style={{ border: "1px solid #ccc", padding: 12 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <strong style={{ flex: 1 }}>{card.title}</strong>
        <button type="button" onClick={handleCopy}>
          {copied ? "コピー済み✓" : "AIに整える"}
        </button>
        <button type="button" onClick={onDelete}>削除</button>
      </div>

      {card.steps && (
        <div style={{ marginTop: 8 }}>
          <strong>手順：</strong>
          <pre style={{ margin: "4px 0", whiteSpace: "pre-wrap" }}>{card.steps}</pre>
        </div>
      )}
      {card.notes && (
        <div style={{ marginTop: 4 }}>
          <strong>注意事項：</strong> {card.notes}
        </div>
      )}
      {card.links && (
        <div style={{ marginTop: 4 }}>
          <strong>関連：</strong> {card.links}
        </div>
      )}
    </article>
  );
}

export function HandoverList({ cards, onDelete }: Props) {
  if (cards.length === 0) {
    return <p>業務内容がまだありません</p>;
  }

  return (
    <div style={{ display: "grid", gap: 12 }}>
      {cards.map((card) => (
        <HandoverItem key={card.id} card={card} onDelete={() => onDelete(card.id)} />
      ))}
    </div>
  );
}
