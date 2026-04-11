import { useEffect, useMemo, useState } from "react";
import type { CardType, Status } from "../types";

function normalizeCards(saved: unknown): CardType[] {
  if (!Array.isArray(saved)) return [];

  return saved.map((x: any) => {
    const status: Status =
      x?.status === "planned" || x?.status === "doing" || x?.status === "done"
        ? x.status
        : "planned";

    return {
      id: typeof x?.id === "string" ? x.id : crypto.randomUUID(),
      title: typeof x?.title === "string" ? x.title : "",
      hypothesis: typeof x?.hypothesis === "string" ? x.hypothesis : "",
      success: typeof x?.success === "string" ? x.success : "",
      status,
      result: typeof x?.result === "string" ? x.result : "",
      learning: typeof x?.learning === "string" ? x.learning : "",
    };
  });
}

export function useCardsStorage(storageKey: string) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [hydrated, setHydrated] = useState(false);

  //load once
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        setCards(normalizeCards(JSON.parse(raw)));
      } catch {
        // ignore
      }
    }
    setHydrated(true);
  }, [storageKey]);

  //save after hydration
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify(cards));
  }, [cards, hydrated, storageKey]);

  //derived lists
  const planned = useMemo(
    () => cards.filter((c) => c.status === "planned"),
    [cards],
  );
  const doing = useMemo(
    () => cards.filter((c) => c.status === "doing"),
    [cards],
  );
  const done = useMemo(() => cards.filter((c) => c.status === "done"), [cards]);

  // actions
  function addCard(input: {
    title: string;
    hypothesis: string;
    success: string;
  }) {
    const t = input.title.trim();
    const h = input.hypothesis.trim();
    const s = input.success.trim();

    if (!t || !h || !s) {
      return { ok: false as const, error: "タイトル・仮説・成功条件は必須です" };
    }

    const newCard: CardType = {
      id: crypto.randomUUID(),
      title: t,
      hypothesis: h,
      success: s,
      status: "planned",
      result: "",
      learning: "",
    };

    setCards((prev) => [newCard, ...prev]);
    return { ok: true as const };
  }

  function deleteCard(id: string) {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }

  function setStatus(id: string, status: Status) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  return {
    cards,
    setCards,
    planned,
    doing,
    done,
    addCard,
    deleteCard,
    setStatus,
  };
}
