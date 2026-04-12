import { useEffect, useState } from "react";

const MEMO_KEY = "action_log_memo_v1";

export function GlobalMemo() {
  const [text, setText] = useState("");

  // 起動時に読み込む
  useEffect(() => {
    const saved = localStorage.getItem(MEMO_KEY);
    if (saved) setText(saved);
  }, []);

  // テキストが変わるたびに保存
  useEffect(() => {
    localStorage.setItem(MEMO_KEY, text);
  }, [text]);

  return (
    <div>
      <h2>メモ</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="AIの回答・コマンド・URLなどを貼り付けて保管"
        style={{ width: "100%", height: 200, boxSizing: "border-box" }}
      />
    </div>
  );
}
