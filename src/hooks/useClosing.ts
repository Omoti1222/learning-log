import { useState } from "react";
import type {
  CardType,
  ClosingDraft,
  ClosingMap,
  ClosingPatch,
} from "../types";

const emptyDraft: ClosingDraft = { result: "", learning: "" };

export function useClosing(args: {
  cards: CardType[];
  setCards: React.Dispatch<React.SetStateAction<CardType[]>>;
}) {
  const { cards, setCards } = args;

  const [closing, setClosing] = useState<ClosingMap>({});

  function startClosing(id: string) {
    const card = cards.find((c) => c.id === id);
    if (!card) return;

    setClosing((prev) => ({
      ...prev,
      [id]: { result: card.result || "", learning: card.learning || "" },
    }));
  }

  function updateClosing(id: string, patch: ClosingPatch) {
    setClosing((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? emptyDraft), ...patch },
    }));
  }

  function cancelClosing(id: string) {
    setClosing((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  }

  function confirmDone(id: string) {
    const draft = closing[id];
    const result = (draft?.result ?? "").trim();
    const learning = (draft?.learning ?? "").trim();

    setCards((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: "done", result, learning, completedAt: new Date().toISOString() }
          : c,
      ),
    );

    cancelClosing(id);
  }

  function cleanupClosing(id: string) {
    cancelClosing(id);
  }

  return {
    closing,
    startClosing,
    updateClosing,
    cancelClosing,
    confirmDone,
    cleanupClosing,
  };
}
