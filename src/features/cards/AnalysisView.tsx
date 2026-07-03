import { useState } from "react";
import type { Block, Experiment, QuestionAngle } from "../../utils/analyzeDone";

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

function QuestionBlock({ angle, text }: { angle: QuestionAngle; text: string }) {
  const style = ANGLE_STYLE[angle] ?? ANGLE_STYLE.perspective;
  return (
    <div
      className={`border-l-4 ${style.border} bg-white border border-slate-200 rounded-lg p-3`}
    >
      <span
        className={`inline-flex items-center gap-1 text-[10px] font-medium rounded px-1.5 py-0.5 mb-1.5 ${style.badge}`}
      >
        {style.icon} {style.label}
      </span>
      <p className="text-sm text-slate-600 leading-relaxed m-0">{text}</p>
    </div>
  );
}

function ComparisonBlock({
  left,
  right,
  note,
}: {
  left: string;
  right: string;
  note: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3">
      <div className="text-[10px] text-slate-400 mb-2">仮説 と 結果</div>
      <div className="flex items-stretch gap-2">
        <div className="flex-1 rounded bg-indigo-50 text-indigo-600 text-xs p-2 leading-relaxed">
          {left}
        </div>
        <div className="flex items-center text-slate-300 text-sm">⇄</div>
        <div className="flex-1 rounded bg-slate-50 text-slate-600 text-xs p-2 leading-relaxed">
          {right}
        </div>
      </div>
      {note && (
        <div className="mt-2 text-xs text-rose-500">⚠ {note}</div>
      )}
    </div>
  );
}

function ChecklistBlock({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3">
      <div className="text-xs font-medium text-slate-500 mb-2">{title}</div>
      <div className="grid gap-1.5">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className="flex items-start gap-2 text-left cursor-pointer"
          >
            <span
              className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center text-[10px] ${
                checked.has(i)
                  ? "bg-emerald-400 border-emerald-400 text-white"
                  : "border-slate-300 text-transparent"
              }`}
            >
              ✓
            </span>
            <span
              className={`text-xs leading-relaxed ${
                checked.has(i)
                  ? "text-slate-300 line-through"
                  : "text-slate-600"
              }`}
            >
              {item}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ExperimentBlock({
  exp,
  added,
  onAdd,
}: {
  exp: Experiment;
  added: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-3 bg-white">
      <div className="text-[10px] text-slate-400 mb-1">次に試す実験</div>
      <strong className="text-sm text-slate-800">{exp.title}</strong>
      <div className="text-xs text-slate-500 mt-1">
        <span className="text-indigo-400 font-semibold mr-1.5">仮説</span>
        {exp.hypothesis}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">
        <span className="text-emerald-500 font-semibold mr-1.5">成功条件</span>
        {exp.success}
      </div>
      <button
        type="button"
        onClick={onAdd}
        disabled={added}
        className="mt-2 text-xs px-2.5 py-1 border border-slate-700 bg-slate-700 text-white rounded hover:bg-slate-800 cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-default"
      >
        {added ? "追加済み ✓" : "カードにする"}
      </button>
    </div>
  );
}

type Props = {
  blocks: Block[];
  addedExperiments: Set<number>;
  onAddExperiment: (exp: Experiment, index: number) => void;
};

export function AnalysisView({ blocks, addedExperiments, onAddExperiment }: Props) {
  return (
    <div className="grid gap-2">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "question":
            return <QuestionBlock key={i} angle={b.angle} text={b.text} />;
          case "comparison":
            return (
              <ComparisonBlock
                key={i}
                left={b.left}
                right={b.right}
                note={b.note}
              />
            );
          case "checklist":
            return <ChecklistBlock key={i} title={b.title} items={b.items} />;
          case "experiment":
            return (
              <ExperimentBlock
                key={i}
                exp={b}
                added={addedExperiments.has(i)}
                onAdd={() => onAddExperiment(b, i)}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
