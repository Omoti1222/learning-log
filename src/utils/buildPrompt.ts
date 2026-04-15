import type { CardType, HandoverCard } from "../types";

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

export function buildHandoverPrompt(card: HandoverCard): string {
  return `
# 以下の業務内容を、誰でも分かる引き継ぎ書として整えてください

## 業務名
${card.title}
${card.steps ? `\n## 手順\n${card.steps}` : ""}
${card.notes ? `\n## 注意事項\n${card.notes}` : ""}
${card.links ? `\n## 関連URL・ファイル\n${card.links}` : ""}

## 出力してほしいもの
- 読みやすく整理された手順（番号付きリスト）
- 注意事項をわかりやすく補足
- 初めてこの業務をする人が迷わないような説明
  `.trim();
}
