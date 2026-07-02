import type { HandoverCard } from "../types";

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
