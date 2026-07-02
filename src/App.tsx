import { useEffect, useState } from "react";
import "./App.css";

import { AddCardForm } from "./features/cards/AddCardForm";
import { Board } from "./features/cards/Board";
import { LogItem } from "./features/cards/LogItem";
import { HandoverForm } from "./features/handover/HandoverForm";
import { HandoverList } from "./features/handover/HandoverList";
import { useCardsStorage } from "./hooks/useCardsStorage";
import { useClosing } from "./hooks/useClosing";
import { useHandoverStorage } from "./hooks/useHandoverStorage";
import { analyzeDone } from "./utils/analyzeDone";
import type {
  AnalyzeResult,
  Experiment,
  QuestionAngle,
} from "./utils/analyzeDone";

const ANGLE_STYLE: Record<
  QuestionAngle,
  { label: string; icon: string; border: string; badge: string }
> = {
  causal: {
    label: "因果と相関",
    icon: "🔗",
    border: "border-l-amber-400",
    badge: "bg-amber-50 text-amber-600",
  },
  assumption: {
    label: "思い込み",
    icon: "💭",
    border: "border-l-indigo-400",
    badge: "bg-indigo-50 text-indigo-500",
  },
  counter: {
    label: "反証の見落とし",
    icon: "⚠️",
    border: "border-l-rose-400",
    badge: "bg-rose-50 text-rose-500",
  },
  reproducibility: {
    label: "再現性・運",
    icon: "🎲",
    border: "border-l-teal-400",
    badge: "bg-teal-50 text-teal-600",
  },
  perspective: {
    label: "別の視点",
    icon: "🔀",
    border: "border-l-violet-400",
    badge: "bg-violet-50 text-violet-500",
  },
};

const STORAGE_KEY = "learning_log_cards_v1";
const ANALYSIS_KEY = "learning_log_analysis_v1";

type PersistedAnalysis = { analysis: AnalyzeResult | null; added: number[] };

function loadAnalysis(): PersistedAnalysis {
  try {
    const raw = localStorage.getItem(ANALYSIS_KEY);
    if (raw) return JSON.parse(raw) as PersistedAnalysis;
  } catch {
    // 破損時は無視して初期値
  }
  return { analysis: null, added: [] };
}

type Tab = "log" | "handover";

export default function App() {
  const [tab, setTab] = useState<Tab>("log");
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(
    () => loadAnalysis().analysis,
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState("");
  const [addedExperiments, setAddedExperiments] = useState<Set<number>>(
    () => new Set(loadAnalysis().added),
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // AI回答を保存（リロードしても維持）
  useEffect(() => {
    localStorage.setItem(
      ANALYSIS_KEY,
      JSON.stringify({ analysis, added: [...addedExperiments] }),
    );
  }, [analysis, addedExperiments]);

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

  // 完了列には直近24時間の完了のみ表示（ログ一覧には全件残す）
  const DAY_MS = 24 * 60 * 60 * 1000;
  const recentDone = done.filter(
    (c) =>
      !c.completedAt || Date.now() - new Date(c.completedAt).getTime() < DAY_MS,
  );

  function onDeleteCard(id: string) {
    deleteCard(id);
    cleanupClosing(id);
  }

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleAnalyze() {
    const selected = done.filter((c) => selectedIds.has(c.id));
    if (selected.length === 0) return;
    setIsAnalyzing(true);
    setAnalyzeError("");
    setAnalysis(null);
    setAddedExperiments(new Set());
    try {
      const result = await analyzeDone(selected);
      setAnalysis(result);
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleAddExperiment(exp: Experiment, index: number) {
    const result = addCard({
      title: exp.title,
      hypothesis: exp.hypothesis,
      success: exp.success,
    });
    if (result.ok) {
      setAddedExperiments((prev) => new Set(prev).add(index));
    }
  }

  const tabBase =
    "px-4 py-1.5 text-sm rounded border cursor-pointer transition-colors";
  const tabActive =
    "border-slate-700 text-slate-700 font-semibold bg-white";
  const tabInactive =
    "border-slate-200 text-slate-400 bg-white hover:bg-slate-50";

  return (
    <div className="p-4 max-w-[1000px] mx-auto">

      <div className="min-w-0">
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
              done={recentDone}
              closing={closing}
              onDeleteCard={onDeleteCard}
              onSetStatus={setStatus}
              onStartClosing={startClosing}
              onUpdateClosing={updateClosing}
              onCancelClosing={cancelClosing}
              onConfirmDone={confirmDone}
            />

            <hr className="my-4 border-gray-200" />

            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-bold text-base text-gray-700 m-0">ログ一覧</h2>
              {done.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || selectedIds.size === 0}
                    className="text-xs px-2.5 py-1 border border-slate-200 bg-white text-slate-500 rounded hover:bg-slate-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-default"
                  >
                    {isAnalyzing ? "分析中..." : "選択した項目をAIに聞く"}
                  </button>
                  <span className="text-xs text-slate-400">
                    {selectedIds.size > 0
                      ? `${selectedIds.size}件選択中`
                      : "チェックで選択"}
                  </span>
                </>
              )}
            </div>

            {analyzeError && (
              <p className="text-red-400 text-sm mb-3">{analyzeError}</p>
            )}

            {isAnalyzing && (
              <div className="mb-4 border border-slate-200 rounded-lg p-4 bg-slate-50/60 flex items-center gap-3">
                <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin shrink-0" />
                <span className="text-sm text-slate-500">
                  AIが選択した{selectedIds.size}件を分析しています…
                </span>
              </div>
            )}

            {!isAnalyzing && analysis && (
              <div className="mb-4 border border-slate-200 rounded-lg p-4 bg-slate-50/60">
                <div className="text-xs text-slate-400 mb-2">
                  AI からの問い（自分の考えと突き合わせてみてください）
                </div>
                <div className="grid gap-2">
                  {analysis.questions.map((q, i) => {
                    const style = ANGLE_STYLE[q.angle];
                    return (
                      <div
                        key={i}
                        className={`border-l-4 ${style.border} bg-white border border-slate-200 rounded-lg p-3`}
                      >
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-medium rounded px-1.5 py-0.5 mb-1.5 ${style.badge}`}
                        >
                          {style.icon} {style.label}
                        </span>
                        <p className="text-sm text-slate-600 leading-relaxed m-0">
                          {q.text}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {analysis.experiments.length > 0 && (
                  <div className="mt-4 grid gap-2">
                    <div className="text-xs text-slate-400">次に試す実験</div>
                    {analysis.experiments.map((exp, i) => (
                      <div
                        key={i}
                        className="border border-slate-200 rounded-lg p-3 bg-white"
                      >
                        <strong className="text-sm text-slate-800">
                          {exp.title}
                        </strong>
                        <div className="text-xs text-slate-500 mt-1">
                          <span className="text-indigo-400 font-semibold mr-1.5">
                            仮説
                          </span>
                          {exp.hypothesis}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          <span className="text-emerald-500 font-semibold mr-1.5">
                            成功条件
                          </span>
                          {exp.success}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddExperiment(exp, i)}
                          disabled={addedExperiments.has(i)}
                          className="mt-2 text-xs px-2.5 py-1 border border-slate-700 bg-slate-700 text-white rounded hover:bg-slate-800 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-default"
                        >
                          {addedExperiments.has(i) ? "追加済み ✓" : "カードにする"}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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
                      <ul className="m-0 p-0 list-none grid gap-1">
                        {cards.map((c) => (
                          <LogItem
                            key={c.id}
                            c={c}
                            selected={selectedIds.has(c.id)}
                            onToggle={() => toggleSelected(c.id)}
                            onDelete={() => onDeleteCard(c.id)}
                          />
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

    </div>
  );
}
