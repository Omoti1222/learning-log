import { useState } from "react";
import { Column } from "../../components/Column";
import { Card } from "../../components/Card";
import { generateDraft } from "../../utils/generateDraft";
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
  onEditTitle: (id: string, title: string) => void;
};

const btnBase =
  "text-xs px-2.5 py-1 border rounded cursor-pointer transition-colors";
const btnDefault = `${btnBase} border-slate-200 bg-white text-slate-500 hover:bg-slate-50`;
const btnPrimary = `${btnBase} border-slate-700 bg-slate-700 text-white hover:bg-slate-800`;

function DoingCard({
  c,
  closing,
  onDeleteCard,
  onSetStatus,
  onStartClosing,
  onUpdateClosing,
  onCancelClosing,
  onConfirmDone,
}: {
  c: CardType;
  closing: ClosingMap;
  onDeleteCard: (id: string) => void;
  onSetStatus: (id: string, status: Status) => void;
  onStartClosing: (id: string) => void;
  onUpdateClosing: (id: string, patch: ClosingPatch) => void;
  onCancelClosing: (id: string) => void;
  onConfirmDone: (id: string) => void;
}) {
  const draft = closing[c.id];
  const isClosing = Boolean(draft);
  const isSimple = !c.hypothesis;
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");

  async function handleGenerateDraft() {
    if (!c.hypothesis) return;
    setIsGenerating(true);
    setGenerateError("");
    try {
      const result = await generateDraft(c.title, c.hypothesis, c.success);
      onUpdateClosing(c.id, {
        result: result.result,
        learning: result.learning,
      });
    } catch (e) {
      setGenerateError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className="border-l-4 border-l-amber-400 rounded-lg">
      <Card c={c} onDelete={() => onDeleteCard(c.id)}>
        <div className="flex items-center gap-1 mb-1.5">
          <span className="text-[10px] bg-amber-100 text-amber-600 rounded px-1.5 py-0.5 font-medium">
            進行中
          </span>
        </div>
        {!isClosing ? (
          <div className="flex gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => onStartClosing(c.id)}
              className={btnPrimary}
            >
              {isSimple ? "完了" : "完了入力"}
            </button>
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
            {!isSimple && (
              <>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateDraft}
                    disabled={isGenerating}
                    className={`${btnDefault} disabled:opacity-50`}
                  >
                    {isGenerating ? "生成中..." : "AI下書き"}
                  </button>
                  {generateError && (
                    <span className="text-xs text-red-400">
                      {generateError}
                    </span>
                  )}
                </div>
                <textarea
                  value={draft.result}
                  onChange={(e) =>
                    onUpdateClosing(c.id, { result: e.currentTarget.value })
                  }
                  placeholder="結果"
                  className="border border-slate-200 rounded px-2 py-1 text-xs w-full resize-y"
                />
                <textarea
                  value={draft.learning}
                  onChange={(e) =>
                    onUpdateClosing(c.id, { learning: e.currentTarget.value })
                  }
                  placeholder="学び(原因)"
                  className="border border-slate-200 rounded px-2 py-1 text-xs w-full resize-y"
                />
              </>
            )}
            <textarea
              value={draft.comment}
              onChange={(e) =>
                onUpdateClosing(c.id, { comment: e.currentTarget.value })
              }
              placeholder="どうだった？（感想・気づき）"
              className="border border-slate-200 rounded px-2 py-1 text-xs w-full resize-y"
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
    </div>
  );
}

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
    onEditTitle,
  } = props;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const total = doing.length + planned.length;

  return (
    <div className="grid gap-3 grid-cols-2">
      {/* やること列 */}
      <section className="border border-slate-200 rounded-lg p-3 bg-slate-50/60">
        <h2 className="font-semibold text-xs text-slate-500 tracking-wide uppercase mb-3 m-0">
          やること <span className="font-normal">({total})</span>
        </h2>

        <div className="grid gap-2">
          {/* 進行中セクション */}
          {doing.length > 0 && (
            <>
              {doing.map((c) => (
                <DoingCard
                  key={c.id}
                  c={c}
                  closing={closing}
                  onDeleteCard={onDeleteCard}
                  onSetStatus={onSetStatus}
                  onStartClosing={onStartClosing}
                  onUpdateClosing={onUpdateClosing}
                  onCancelClosing={onCancelClosing}
                  onConfirmDone={onConfirmDone}
                />
              ))}
              {planned.length > 0 && (
                <div className="flex items-center gap-2 my-1">
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="text-[10px] text-slate-300">予定</span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>
              )}
            </>
          )}

          {/* 予定セクション */}
          {planned.length === 0 && doing.length === 0 ? (
            <div className="text-slate-300 text-sm">なし</div>
          ) : (
            planned.map((c) => (
              <Card key={c.id} c={c} onDelete={() => onDeleteCard(c.id)}>
                {editingId === c.id ? (
                  <div className="grid gap-2 w-full mt-2">
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border border-slate-200 rounded px-2 py-1 text-xs w-full"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          onEditTitle(c.id, editText);
                          setEditingId(null);
                        }}
                        className={btnPrimary}
                      >
                        保存
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className={btnDefault}
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-1 flex-wrap">
                    <button
                      type="button"
                      onClick={() => onSetStatus(c.id, "doing")}
                      className={btnDefault}
                    >
                      進行中へ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(c.id);
                        setEditText(c.title);
                      }}
                      className={btnDefault}
                    >
                      編集
                    </button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      </section>

      {/* 完了列 */}
      <Column title="完了" items={done}>
        {(c) => (
          <Card key={c.id} c={c} onDelete={() => onDeleteCard(c.id)}>
            {c.result || c.learning ? (
              <div className="mt-2 text-xs text-slate-500 grid gap-0.5">
                {c.result && (
                  <div>
                    <strong>結果:</strong> {c.result}
                  </div>
                )}
                {c.learning && (
                  <div>
                    <strong>学び:</strong> {c.learning}
                  </div>
                )}
              </div>
            ) : null}
            {c.comment && (
              <div className="mt-1 text-xs text-slate-500">
                <strong>コメント:</strong> {c.comment}
              </div>
            )}
            <button
              type="button"
              onClick={() => onSetStatus(c.id, "planned")}
              className={`${btnDefault} mt-1`}
            >
              予定に戻す
            </button>
          </Card>
        )}
      </Column>
    </div>
  );
}
