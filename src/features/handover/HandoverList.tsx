import type { HandoverCard } from "../../types";
import { buildHandoverPrompt } from "../../utils/buildPrompt";
import { useState } from "react";

type Props = {
  cards: HandoverCard[];
  onDelete: (id: string) => void;
};

function HandoverItem({
  card,
  onDelete,
}: {
  card: HandoverCard;
  onDelete: () => void;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const prompt = buildHandoverPrompt(card);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <article className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex gap-2 items-center">
        <strong className="flex-1 text-sm">{card.title}</strong>
        <button
          type="button"
          onClick={handleCopy}
          className="text-xs px-2 py-1 border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
        >
          {copied ? "コピー済み✓" : "AIに整える"}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-xs px-2 py-1 border border-red-200 text-red-500 rounded hover:bg-red-50 cursor-pointer"
        >
          削除
        </button>
      </div>

      {card.steps && (
        <div className="mt-2">
          <strong className="text-xs text-gray-600">手順：</strong>
          <pre className="my-1 whitespace-pre-wrap text-xs text-gray-700">
            {card.steps}
          </pre>
        </div>
      )}
      {card.notes && (
        <div className="mt-1 text-xs text-gray-600">
          <strong>注意事項：</strong> {card.notes}
        </div>
      )}
      {card.links && (
        <div className="mt-1 text-xs text-gray-600">
          <strong>関連：</strong> {card.links}
        </div>
      )}
    </article>
  );
}

export function HandoverList({ cards, onDelete }: Props) {
  if (cards.length === 0) {
    return <p className="text-gray-500 text-sm">業務内容がまだありません</p>;
  }

  return (
    <div className="grid gap-3">
      {cards.map((card) => (
        <HandoverItem
          key={card.id}
          card={card}
          onDelete={() => onDelete(card.id)}
        />
      ))}
    </div>
  );
}
