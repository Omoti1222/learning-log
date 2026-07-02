import Anthropic from "@anthropic-ai/sdk";

type Draft = { result: string; learning: string };

export async function generateDraft(
  title: string,
  hypothesis: string,
  success: string,
): Promise<Draft> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error(".env.local に VITE_ANTHROPIC_API_KEY を設定してください");
  }

  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });

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
  if (!match) throw new Error("AIの応答を解析できませんでした");
  return JSON.parse(match[0]) as Draft;
}
