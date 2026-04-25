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

  const tabBase =
    "px-4 py-1.5 text-sm rounded border cursor-pointer";
  const tabActive =
    "border-blue-500 text-blue-600 font-bold bg-white";
  const tabInactive =
    "border-gray-300 text-gray-500 bg-white hover:bg-gray-50";

  return (
    <div className="p-4 max-w-[1400px] mx-auto flex gap-4 items-start">

      <div className="flex-1 min-w-0">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => setTab("log")}
            className={`${tabBase} ${tab === "log" ? tabActive : tabInactive}`}
          >
            行動ログ
          </button>
          <button
            type="button"
            onClick={() => setTab("handover")}
            className={`${tabBase} ${tab === "handover" ? tabActive : tabInactive}`}
          >
            業務内容
          </button>
        </div>

        {tab === "log" && (
          <>
            <AddCardForm onAddCard={addCard} />

            <hr className="my-4 border-gray-200" />

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

            <hr className="my-4 border-gray-200" />

            <h2 className="font-bold text-base text-gray-700 mb-3">ログ一覧</h2>
            {done.length === 0 ? (
              <p className="text-gray-500 text-sm">まだ完了がありません</p>
            ) : (
              (() => {
                const groups: Record<string, typeof done> = {};
                done.forEach((c) => {
                  const date = c.completedAt
                    ? new Date(c.completedAt).toLocaleDateString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "日付不明";
                  if (!groups[date]) groups[date] = [];
                  groups[date].push(c);
                });

                return Object.entries(groups)
                  .sort(([a], [b]) => b.localeCompare(a))
                  .map(([date, cards]) => (
                    <div key={date} className="mb-4">
                      <div className="border-b border-gray-300 mb-2 pb-1 font-bold text-sm text-gray-600">
                        {date}
                      </div>
                      <ul className="pl-[18px] m-0 grid gap-1">
                        {cards.map((c) => (
                          <li key={c.id} className="text-sm">
                            <span className="text-gray-400 text-xs mr-2">
                              {c.completedAt
                                ? new Date(c.completedAt).toLocaleTimeString(
                                    "ja-JP",
                                    { hour: "2-digit", minute: "2-digit" },
                                  )
                                : ""}
                            </span>
                            <strong>{c.learning || c.title}</strong>
                            {c.learning && (
                              <span className="text-gray-500 text-xs">
                                {" "}
                                ({c.title})
                              </span>
                            )}
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
            <h2 className="font-bold text-base text-gray-700 mb-3">業務内容</h2>
            <HandoverForm onAddCard={addHandoverCard} />
            <hr className="my-4 border-gray-200" />
            <HandoverList cards={handoverCards} onDelete={deleteHandoverCard} />
          </>
        )}
      </div>

      <div className="w-[280px] shrink-0">
        <GlobalMemo />
      </div>

    </div>
  );
}
