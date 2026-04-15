export type Status = "planned" | "doing" | "done";

export type CardType = {
  id: string;
  title: string;
  hypothesis: string;
  success: string;
  status: Status;
  result: string;
  learning: string;
  createdAt: string;    // 作成日時（ISO文字列）
  completedAt?: string; // 完了日時（Done確定時にセット）
};

export type ClosingDraft = {
  result: string;
  learning: string;
};

export type ClosingMap = Record<string, ClosingDraft>;
export type ClosingPatch = Partial<ClosingDraft>;

export type HandoverCard = {
  id: string;
  title: string;  // 業務名
  steps: string;  // 手順
  notes: string;  // 注意事項
  links: string;  // 関連URL・ファイルパス
};
