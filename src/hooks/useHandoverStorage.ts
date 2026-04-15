import { useEffect, useState } from "react";
import type { HandoverCard } from "../types";

const HANDOVER_KEY = "action_log_handover_v1";

export function useHandoverStorage() {
  const [cards, setCards] = useState<HandoverCard[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // 起動時に読み込む
  useEffect(() => {
    const raw = localStorage.getItem(HANDOVER_KEY);
    if (raw) {
      try {
        setCards(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
    setHydrated(true);
  }, []);

  // 変更のたびに保存
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(HANDOVER_KEY, JSON.stringify(cards));
  }, [cards, hydrated]);

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
