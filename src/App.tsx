import { useState } from "react";
import "./App.css";

import { AddCardForm } from "./features/cards/AddCardForm";
import { Board } from "./features/cards/Board";
import { GlobalMemo } from "./components/GlobalMemo";
import { HandoverForm } from "./features/handover/HandoverForm";
import { HandoverList } from "./features/handover/HandoverList";
import { useCardsStorage } from "./hooks/useCardsStorage";
import { useClosing } from "./hooks/useClosing";
import { useHandoverStorage } from "./hooks/useHandoverStorage";

const STORAGE_KEY = "learning_log_cards_v1";

type Tab = "log" | "handover";

export default function App() {
  const [tab, setTab] = useState<Tab>("log");

  const {
    cards,
    setCards,
    planned,
    doing,
    done,
    addCard,
    deleteCard,
    setStatus,
  } = useCardsStorage(STORAGE_KEY);

  const {
    closing,
    startClosing,
    updateClosing,
    cancelClosing,
    confirmDone,
    cleanupClosing,
  } = useClosing({ cards, setCards });

  const {
    cards: handoverCards,
    addCard: addHandoverCard,
    deleteCard: deleteHandoverCard,
  } = useHandoverStorage();

  function onDeleteCard(id: string) {
    deleteCard(id);
    cleanupClosing(id);
  }

  return (
    <div style={{ padding: 16, maxWidth: 1400, margin: "0 auto", display: "flex", gap: 16, alignItems: "flex-start" }}>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setTab("log")}
            style={{ fontWeight: tab === "log" ? "bold" : "normal" }}
          >
            行動ログ
          </button>
          <button
            type="button"
            onClick={() => setTab("handover")}
            style={{ fontWeight: tab === "handover" ? "bold" : "normal" }}
          >
            業務内容
          </button>
        </div>

        {tab === "log" && (
          <>
            <AddCardForm onAddCard={addCard} />

            <hr />

            <Board
              planned={planned}
              doing={doing}
              done={done}
              closing={closing}
              onDeleteCard={onDeleteCard}
              onSetStatus={setStatus}
              onStartClosing={startClosing}
              onUpdateClosing={updateClosing}
              onCancelClosing={cancelClosing}
              onConfirmDone={confirmDone}
            />

            <hr />

            <h2>ログ一覧</h2>
            {done.length === 0 ? (
              <p>まだ完了がありません</p>
            ) : (
              (() => {
                // 完了日でグループ化
                const groups: Record<string, typeof done> = {};
                done.forEach((c) => {
                  const date = c.completedAt
                    ? new Date(c.completedAt).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" })
                    : "日付不明";
                  if (!groups[date]) groups[date] = [];
                  groups[date].push(c);
                });

                // 新しい日付順に並べる
                return Object.entries(groups)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([date, cards]) => (
                    <div key={date} style={{ marginBottom: 16 }}>
                      <div style={{ borderBottom: "1px solid #ccc", marginBottom: 8, paddingBottom: 4, fontWeight: "bold" }}>
                        {date}
                      </div>
                      <ul style={{ paddingLeft: 18, margin: 0 }}>
                        {cards.map((c) => (
                          <li key={c.id}>
                            <span style={{ color: "#888", fontSize: 12, marginRight: 8 }}>
                              {c.completedAt
                                ? new Date(c.completedAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })
                                : ""}
                            </span>
                            <strong>{c.learning || c.title}</strong>
                            {c.learning && <span style={{ color: "#888" }}> ({c.title})</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ));
              })()
            )}
          </>
        )}

        {tab === "handover" && (
          <>
            <h2>業務内容</h2>
            <HandoverForm onAddCard={addHandoverCard} />
            <hr />
            <HandoverList cards={handoverCards} onDelete={deleteHandoverCard} />
          </>
        )}
      </div>

      <div style={{ width: 280, flexShrink: 0 }}>
        <GlobalMemo />
      </div>

    </div>
  );
}
