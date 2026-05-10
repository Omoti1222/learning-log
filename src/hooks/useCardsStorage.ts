import { useEffect, useMemo, useState } from "react";
import type { CardType, Status } from "../types";

function prop(obj: unknown, key: string): unknown {
  if (typeof obj === "object" && obj !== null) {
    return (obj as Record<string, unknown>)[key];
  }
  return undefined;
}

function normalizeCards(saved: unknown): CardType[] {
  if (!Array.isArray(saved)) return [];

  return saved.map((x: unknown) => {
    const s = prop(x, "status");
    const status: Status =
      s === "planned" || s === "doing" || s === "done" ? s : "planned";

    const id = prop(x, "id");
    const title = prop(x, "title");
    const hypothesis = prop(x, "hypothesis");
    const success = prop(x, "success");
    const result = prop(x, "result");
    const learning = prop(x, "learning");
    const createdAt = prop(x, "createdAt");
    const completedAt = prop(x, "completedAt");

    return {
      id: typeof id === "string" ? id : crypto.randomUUID(),
      title: typeof title === "string" ? title : "",
      hypothesis: typeof hypothesis === "string" ? hypothesis : "",
      success: typeof success === "string" ? success : "",
      status,
      result: typeof result === "string" ? result : "",
      learning: typeof learning === "string" ? learning : "",
      createdAt: typeof createdAt === "string" ? createdAt : new Date().toISOString(),
      completedAt: typeof completedAt === "string" ? completedAt : undefined,
    };
  });
}

function loadCards(storageKey: string): CardType[] {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return [];
  try {
    return normalizeCards(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function useCardsStorage(storageKey: string) {
  const [cards, setCards] = useState<CardType[]>(() => loadCards(storageKey));

  // 変更のたびに保存
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(cards));
  }, [cards, storageKey]);

  // derived lists
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
    hypothesis?: string;
    success?: string;
  }) {
    const t = input.title.trim();
    const h = (input.hypothesis ?? "").trim();
    const s = (input.success ?? "").trim();

    if (!t) {
      return { ok: false as const, error: "タイトルは必須です" };
    }

    const newCard: CardType = {
      id: crypto.randomUUID(),
      title: t,
      hypothesis: h,
      success: s,
      status: "planned",
      result: "",
      learning: "",
      createdAt: new Date().toISOString(),
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
