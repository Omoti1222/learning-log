type Draft = { result: string; learning: string };

export async function generateDraft(
  title: string,
  hypothesis: string,
  success: string,
): Promise<Draft> {
  const res = await fetch("/api/generate-draft", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, hypothesis, success }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.error ?? "下書きの生成に失敗しました");
  }

  return body as Draft;
}
