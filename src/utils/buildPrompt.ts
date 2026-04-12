import type { CardType } from "../types";

export function buildPrompt(card: CardType): string {
  if (card.status === "planned" || card.status === "doing") {
    return `
# タスクの仮説・成功条件を考えてください

## タスク
${card.title}

## 出力してほしいもの
1. 仮説（「〇〇をすれば△△になるはず」の形式で）
2. 成功条件（具体的・測定可能な形で）
3. 注意点（1〜2個）
    `.trim();
  }

  return `
# 振り返りのサポートをしてください

## タスク
${card.title}
${card.hypothesis ? `\n## 仮説\n${card.hypothesis}` : ""}
${card.success ? `\n## 成功条件\n${card.success}` : ""}
${card.result ? `\n## 実際の結果\n${card.result}` : ""}
${card.learning ? `\n## 得た学び\n${card.learning}` : ""}

## 質問
この結果と学びをもとに、次に活かせるアクションを提案してください。
  `.trim();
}
