import { useEffect, useState } from "react";
import type { HandoverCard } from "../types";

const HANDOVER_KEY = "action_log_handover_v1";

function loadHandoverCards(): HandoverCard[] {
  const raw = localStorage.getItem(HANDOVER_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed as HandoverCard[];
    return [];
  } catch {
    return [];
  }
}

export function useHandoverStorage() {
  const [cards, setCards] = useState<HandoverCard[]>(loadHandoverCards);

  // 変更のたびに保存
  useEffect(() => {
    localStorage.setItem(HANDOVER_KEY, JSON.stringify(cards));
  }, [cards]);

  function addCard(input: Omit<HandoverCard, "id">) {
    if (!input.title.trim()) {
      return { ok: false as const, error: "業務名は必須です" };
    }
    const newCard: HandoverCard = {
      id: crypto.randomUUID(),
      ...input,
    };
    setCards((prev) => [newCard, ...prev]);
    return { ok: true as const };
  }

  function deleteCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  return { cards, addCard, deleteCard };
}
