import { useAuthActions } from "@convex-dev/auth/react";

export function SignIn() {
  const { signIn } = useAuthActions();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
        <h1 className="font-bold text-lg text-slate-700 mb-4">行動ログ</h1>
        <p className="text-sm text-slate-500 mb-6">ログインする</p>
        <button
          type="button"
          onClick={() => signIn("github")}
          className="px-4 py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-900 cursor-pointer"
        >
          GitHubでログイン
        </button>
      </div>
    </div>
  );
}
