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

const btnBase =
  "text-xs px-2 py-1 border rounded cursor-pointer";
const btnDefault =
  `${btnBase} border-gray-300 bg-white hover:bg-gray-100`;
const btnPrimary =
  `${btnBase} border-blue-500 bg-blue-500 text-white hover:bg-blue-600`;

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
    <div className="grid gap-3 grid-cols-3">
      <Column title="予定" items={planned}>
        {(c) => (
          <Card key={c.id} c={c} onDelete={() => onDeleteCard(c.id)}>
            <button
              type="button"
              onClick={() => onSetStatus(c.id, "doing")}
              className={btnDefault}
            >
              進行中へ
            </button>
          </Card>
        )}
      </Column>

      <Column title="進行中" items={doing}>
        {(c) => {
          const draft = closing[c.id];
          const isClosing = Boolean(draft);
          const isSimple = !c.hypothesis;

          return (
            <Card key={c.id} c={c} onDelete={() => onDeleteCard(c.id)}>
              {!isClosing ? (
                <div className="flex gap-1 flex-wrap">
                  {isSimple ? (
                    <button
                      type="button"
                      onClick={() => onSetStatus(c.id, "done")}
                      className={btnPrimary}
                    >
                      完了
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onStartClosing(c.id)}
                      className={btnPrimary}
                    >
                      完了入力
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onSetStatus(c.id, "planned")}
                    className={btnDefault}
                  >
                    予定に戻る
                  </button>
                </div>
              ) : (
                <div className="grid gap-2 w-full mt-2">
                  <textarea
                    value={draft.result}
                    onChange={(e) =>
                      onUpdateClosing(c.id, { result: e.currentTarget.value })
                    }
                    placeholder="結果"
                    className="border border-gray-300 rounded px-2 py-1 text-xs w-full resize-y"
                  />
                  <textarea
                    value={draft.learning}
                    onChange={(e) =>
                      onUpdateClosing(c.id, { learning: e.currentTarget.value })
                    }
                    placeholder="学び(原因)"
                    className="border border-gray-300 rounded px-2 py-1 text-xs w-full resize-y"
                  />
                  <div className="flex gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onConfirmDone(c.id)}
                      className={btnPrimary}
                    >
                      完了確定
                    </button>
                    <button
                      type="button"
                      onClick={() => onCancelClosing(c.id)}
                      className={btnDefault}
                    >
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
            <div className="mt-2 text-xs text-gray-600 grid gap-0.5">
              <div>
                <strong>結果:</strong> {c.result}
              </div>
              <div>
                <strong>学び:</strong> {c.learning}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSetStatus(c.id, "doing")}
              className={`${btnDefault} mt-1`}
            >
              進行中に戻す
            </button>
          </Card>
        )}
      </Column>
    </div>
  );
}
