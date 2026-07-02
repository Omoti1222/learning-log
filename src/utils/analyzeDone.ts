import Anthropic from "@anthropic-ai/sdk";
import type { CardType } from "../types";

export type Experiment = {
  title: string;
  hypothesis: string;
  success: string;
};

export type QuestionAngle =
  | "causal"
  | "assumption"
  | "counter"
  | "reproducibility"
  | "perspective";

export type Question = {
  text: string;
  angle: QuestionAngle;
};

export type AnalyzeResult = {
  questions: Question[];
  experiments: Experiment[];
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
    max_tokens: 1200,
    messages: [
      {
        role: "user",
        content: `以下は私が完了した行動・仮説検証のリストです。結果や学びは私自身が書いたものです。

${cardSummaries}

あなたの役割は答えを出すことではなく、私の思考の盲点を突く「壁打ち相手」です。
私が自分の結果・学びを書く中で見落としていそうな点を、問いの形で返してください。

次の2つを返してください。

1. questions: 私が考えていなさそうな問いを「ちょうど2つ」。以下の5観点(angle)から選ぶこと:
   - "causal": 因果と相関の取り違え（本当にそれが原因か、別の要因では？）
   - "assumption": 未検証の思い込み（前提として疑っていない点は？）
   - "counter": 反証の見落とし（うまくいかなかった場合や例外はなかったか？）
   - "reproducibility": 再現性・運（たまたまではないか、条件を変えても再現するか？）
   - "perspective": 別の視点・考察（全く違う角度から見るとどう解釈できるか？）

   2つの選び方は次の基準に従うこと:
   - 盲点度: 私が書いた結果・学び・コメントで「まだ触れていない」角度を最優先する（既に自分で考えている点は選ばない）。
   - 多様性: 2つは必ず異なる観点(angle)にし、思考の方向が被らないようにする。
   - 偏り回避: "causal"と"counter"は当てはめやすく偏りがちなので、両方を同時に選ぶのは避ける。"assumption"（思い込み）・"reproducibility"（再現性）・"perspective"（別視点）が少しでも当てはまるなら、そちらを積極的に選ぶこと。少なくとも1つはこの3観点から選ぶのが望ましい。
   断定や助言ではなく、私自身が考え直したくなる問いにすること。

2. experiments: 問いを踏まえて次に試す価値のある実験を2〜3個。各実験は新しい仮説検証カードとして使えるよう、具体的なタイトル・仮説・成功条件を持つこと。

必ず以下のJSON形式のみで返してください:
{
  "questions": [
    {"text": "問いの文章", "angle": "causal"}
  ],
  "experiments": [
    {"title": "実験のタイトル", "hypothesis": "〇〇すれば△△になるはず", "success": "具体的・測定可能な成功条件"}
  ]
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AIの応答を解析できませんでした");
  return JSON.parse(match[0]) as AnalyzeResult;
}
