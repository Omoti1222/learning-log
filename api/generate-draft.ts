import Anthropic from "@anthropic-ai/sdk";

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

    let body: { title?: string; hypothesis?: string; success?: string };
    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: "リクエストの形式が不正です" },
        { status: 400 },
      );
    }

    const title = truncate(body.title, MAX_FIELD_LENGTH);
    const hypothesis = truncate(body.hypothesis, MAX_FIELD_LENGTH);
    const success = truncate(body.success, MAX_FIELD_LENGTH);
    if (!title) {
      return Response.json({ error: "タイトルは必須です" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });

    try {
      const message = await client.messages.create({
        model: "claude-opus-4-8",
        max_tokens: 400,
        messages: [
          {
            role: "user",
            content: `仮説検証の振り返りを短く下書きしてください。

タイトル: ${title}
仮説: ${hypothesis}
成功条件: ${success}

JSON形式で返してください:
{"result": "実際の結果（2〜3文）", "learning": "学びや気づき（2〜3文）"}`,
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

      const parsed = JSON.parse(match[0]) as {
        result?: unknown;
        learning?: unknown;
      };
      if (
        typeof parsed.result !== "string" ||
        typeof parsed.learning !== "string"
      ) {
        return Response.json(
          { error: "AIの応答を解析できませんでした" },
          { status: 502 },
        );
      }

      return Response.json({ result: parsed.result, learning: parsed.learning });
    } catch (e) {
      const message = e instanceof Error ? e.message : "下書きの生成に失敗しました";
      return Response.json({ error: message }, { status: 502 });
    }
  },
};
