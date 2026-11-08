import type { CardType } from "../types";

export type QuestionAngle =
  | "causal"
  | "assumption"
  | "counter"
  | "reproducibility"
  | "perspective";

export type Experiment = {
  title: string;
  hypothesis: string;
  success: string;
};

// AIが内容に応じて表示形式を選ぶ（コンポーネント選択パターン）
export type Block =
  | { type: "question"; angle: QuestionAngle; text: string }
  | { type: "comparison"; left: string; right: string; note: string }
  | { type: "checklist"; title: string; items: string[] }
  | ({ type: "experiment" } & Experiment);

export type AnalyzeResult = {
  blocks: Block[];
};

export async function analyzeDone(cards: CardType[]): Promise<AnalyzeResult> {
  const payload = cards.map((c) => ({
    title: c.title,
    hypothesis: c.hypothesis,
    success: c.success,
    result: c.result,
    learning: c.learning,
    comment: c.comment,
  }));

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cards: payload }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error ?? "AI分析に失敗しました");
  }

  return body as AnalyzeResult;
}
