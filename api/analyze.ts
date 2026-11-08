import Anthropic from "@anthropic-ai/sdk";

type CardInput = {
  title?: string;
  hypothesis?: string;
  success?: string;
  result?: string;
  learning?: string;
  comment?: string;
};

const MAX_CARDS = 30;
const MAX_FIELD_LENGTH = 2000;

function truncate(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.length > max ? value.slice(0, max) : value;
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "サーバーにAPIキーが設定されていません" },
        { status: 500 },
      );
    }

    let body: { cards?: CardInput[] };
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "リクエストの形式が不正です" },
        { status: 400 },
      );
    }

    const rawCards = Array.isArray(body.cards) ? body.cards : [];
    const cards = rawCards.slice(0, MAX_CARDS);
    if (cards.length === 0) {
      return Response.json(
        { error: "カードが選択されていません" },
        { status: 400 },
      );
    }

    const cardSummaries = cards
      .map((c, i) => {
        const title = truncate(c.title, MAX_FIELD_LENGTH);
        const hypothesis = truncate(c.hypothesis, MAX_FIELD_LENGTH);
        const success = truncate(c.success, MAX_FIELD_LENGTH);
        const result = truncate(c.result, MAX_FIELD_LENGTH);
        const learning = truncate(c.learning, MAX_FIELD_LENGTH);
        const comment = truncate(c.comment, MAX_FIELD_LENGTH);

        const parts = [`${i + 1}. ${title}`];
        if (hypothesis) parts.push(`   仮説: ${hypothesis}`);
        if (success) parts.push(`   成功条件: ${success}`);
        if (result) parts.push(`   結果: ${result}`);
        if (learning) parts.push(`   学び: ${learning}`);
        if (comment) parts.push(`   コメント: ${comment}`);
        return parts.join("\n");
      })
      .join("\n\n");

    const client = new Anthropic({ apiKey });

    try {
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
      if (!match) {
        return Response.json(
          { error: "AIの応答を解析できませんでした" },
          { status: 502 },
        );
      }

      const parsed = JSON.parse(match[0]) as { blocks?: unknown };
      if (!Array.isArray(parsed.blocks)) {
        return Response.json(
          { error: "AIの応答を解析できませんでした" },
          { status: 502 },
        );
      }

      return Response.json({ blocks: parsed.blocks });
    } catch (e) {
      const message = e instanceof Error ? e.message : "AI分析に失敗しました";
      return Response.json({ error: message }, { status: 502 });
    }
  },
};
