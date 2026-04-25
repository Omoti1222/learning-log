import { useEffect, useState } from "react";

const MEMO_KEY = "action_log_memo_v1";

export function GlobalMemo() {
  const [text, setText] = useState(
    () => localStorage.getItem(MEMO_KEY) ?? "",
  );

  useEffect(() => {
    localStorage.setItem(MEMO_KEY, text);
  }, [text]);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <h2 className="font-bold text-sm text-gray-600 m-0 mb-2">メモ</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="AIの回答・コマンド・URLなどを貼り付けて保管"
        className="w-full h-[200px] border border-gray-200 rounded px-2 py-1.5 text-sm resize-y box-border"
      />
    </div>
  );
}
