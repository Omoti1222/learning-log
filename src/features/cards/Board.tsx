import { Column } from "../../components/Column";
import { Card } from "../../components/Card";
import type { CardType, ClosingMap, ClosingPatch, Status } from "../../types";

type Props = {
  planned: CardType[];
  doing: CardType[];
  done: CardType[];

  closing: ClosingMap;

  onDeleteCard: (id: string) => void;
  onSetStatus: (id: string, status: Status) => void;

  onStartClosing: (id: string) => void;
  onUpdateClosing: (id: string, patch: ClosingPatch) => void;
  onCancelClosing: (id: string) => void;
  onConfirmDone: (id: string) => void;
};

export function Board(props: Props) {
  const {
    planned,
    doing,
    done,
    closing,
    onDeleteCard,
    onSetStatus,
    onStartClosing,
    onUpdateClosing,
    onCancelClosing,
    onConfirmDone,
  } = props;

  return (
    <div
      style={{ display: "grid", gap: 12, gridTemplateColumns: "1fr 1fr 1fr" }}
    >
      <Column title="予定" items={planned}>
        {(c) => (
          <Card key={c.id} c={c} onDelete={() => onDeleteCard(c.id)}>
            <button type="button" onClick={() => onSetStatus(c.id, "doing")}>
              Doingへ
            </button>
          </Card>
        )}
      </Column>

      <Column title="進行中" items={doing}>
        {(c) => {
          const draft = closing[c.id];
          const isClosing = Boolean(draft);

          return (
            <Card key={c.id} c={c} onDelete={() => onDeleteCard(c.id)}>
              {!isClosing ? (
                <>
                  <button type="button" onClick={() => onStartClosing(c.id)}>
                    Done (入力へ)
                  </button>
                  <button
                    type="button"
                    onClick={() => onSetStatus(c.id, "planned")}
                  >
                    plannedに戻る
                  </button>
                </>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gap: 8,
                    width: "100%",
                    marginTop: 10,
                  }}
                >
                  <textarea
                    value={draft.result}
                    onChange={(e) =>
                      onUpdateClosing(c.id, { result: e.currentTarget.value })
                    }
                    placeholder="結果"
                  />
                  <textarea
                    value={draft.learning}
                    onChange={(e) =>
                      onUpdateClosing(c.id, { learning: e.currentTarget.value })
                    }
                    placeholder="学び(原因)"
                  />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button type="button" onClick={() => onConfirmDone(c.id)}>
                      完了確定
                    </button>
                    <button type="button" onClick={() => onCancelClosing(c.id)}>
                      キャンセル
                    </button>
                  </div>
                </div>
              )}
            </Card>
          );
        }}
      </Column>

      <Column title="完了" items={done}>
        {(c) => (
          <Card key={c.id} c={c} onDelete={() => onDeleteCard(c.id)}>
            <div style={{ marginTop: 8 }}>
              <div>
                <strong>結果:</strong> {c.result}
              </div>
              <div>
                <strong>学び:</strong> {c.learning}
              </div>
            </div>
            <button type="button" onClick={() => onSetStatus(c.id, "doing")}>
              Doingに戻す
            </button>
          </Card>
        )}
      </Column>
    </div>
  );
}
