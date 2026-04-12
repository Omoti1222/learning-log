import "./App.css";

import { AddCardForm } from "./features/cards/AddCardForm";
import { Board } from "./features/cards/Board";
import { GlobalMemo } from "./components/GlobalMemo";
import { useCardsStorage } from "./hooks/useCardsStorage";
import { useClosing } from "./hooks/useClosing";

const STORAGE_KEY = "learning_log_cards_v1";

export default function App() {
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

  function onDeleteCard(id: string) {
    deleteCard(id);
    cleanupClosing(id);
  }

  return (
    <div style={{ padding: 16, maxWidth: 1400, margin: "0 auto" }}>
      <h1>行動ログ</h1>

      <AddCardForm onAddCard={addCard} />

      <hr />

      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
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
        </div>

        <div style={{ width: 280, flexShrink: 0 }}>
          <GlobalMemo />
        </div>
      </div>

      <hr />

      <h2>ログ一覧</h2>
      <ul style={{ paddingLeft: 18 }}>
        {done.length === 0 ? (
          <li>まだDoneがありません</li>
        ) : (
          done.map((c) => (
            <li key={c.id}>
              <strong>{c.learning}</strong> ({c.title})
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
