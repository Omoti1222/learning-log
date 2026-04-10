import "./App.css";

import { AddCardForm } from "./features/cards/AddCardForm";
import { Board } from "./features/cards/Board";
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
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1>タイトル</h1>

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

      <h2>学びだけ一覧</h2>
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
