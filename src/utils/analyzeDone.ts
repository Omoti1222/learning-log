import Anthropic from "@anthropic-ai/sdk";
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
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error(".env.local に VITE_ANTHROPIC_API_KEY を設定してください");
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

  const cardSummaries = cards
    .map((c, i) => {
      const parts = [`${i + 1}. ${c.title}`];
      if (c.hypothesis) parts.push(`   仮説: ${c.hypothesis}`);
      if (c.success) parts.push(`   成功条件: ${c.success}`);
      if (c.result) parts.push(`   結果: ${c.result}`);
      if (c.learning) parts.push(`   学び: ${c.learning}`);
      if (c.comment) parts.push(`   コメント: ${c.comment}`);
      return parts.join("\n");
    })
    .join("\n\n");

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1400,
    messages: [
      {
        role: "user",
        content: `以下は私が完了した行動・仮説検証のリストです。結果や学びは私自身が書いたものです。

${cardSummaries}

あなたの役割は答えを出すことではなく、私の思考の盲点を突く「壁打ち相手」です。
内容に応じて最適な"表示ブロック"を選び、blocks配列として返してください。使えるブロックは4種類です。

1. question（問い）: 私が見落としていそうな点を問いの形で。2〜3個。各問いは以下の観点(angle)を付ける:
   - "causal"（因果と相関）/ "assumption"（思い込み）/ "counter"（反証の見落とし）/ "reproducibility"（再現性・運）/ "perspective"（別の視点）
   選び方: 私が既に書いている点は避け（盲点度）、観点は被らせない（多様性）。"causal"と"counter"だけに偏らせず、他の観点が当てはまるなら積極的に選ぶ。

2. comparison（比較）: 仮説と実際の結果に食い違い（ギャップ）がある時だけ使う。left=仮説の想定、right=実際の結果、note=ギャップの要点。ギャップが無ければ省略。

3. checklist（確認リスト）: 次に確かめるべき具体的な確認項目。title=見出し、items=2〜4個の短い確認事項。

4. experiment（次の実験）: 次に試す価値のある新しい仮説検証。1〜2個。カード化して使うのでtitle/hypothesis/successを具体的に。

内容に本当に合うブロックだけを選ぶこと（無理に全種類使わない）。順序は question → comparison → checklist → experiment を目安に。

必ず以下のJSON形式のみで返してください:
{
  "blocks": [
    {"type": "question", "angle": "causal", "text": "問いの文章"},
    {"type": "comparison", "left": "仮説の想定", "right": "実際の結果", "note": "ギャップの要点"},
    {"type": "checklist", "title": "次に確かめること", "items": ["確認1", "確認2"]},
    {"type": "experiment", "title": "実験タイトル", "hypothesis": "〇〇すれば△△になるはず", "success": "測定可能な成功条件"}
  ]
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AIの応答を解析できませんでした");

  const parsed = JSON.parse(match[0]) as Partial<AnalyzeResult>;
  if (!Array.isArray(parsed.blocks)) {
    throw new Error("AIの応答を解析できませんでした");
  }
  return { blocks: parsed.blocks };
}
