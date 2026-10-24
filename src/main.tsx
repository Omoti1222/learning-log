import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
// import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import "./index.css";
import App from "./App.tsx";
// import { SignIn } from "./features/auth/SignIn.tsx";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConvexAuthProvider client={convex}>
      {/* ログイン必須化を一時的に無効化（公開版をログイン無しで使えるようにするため）
         元に戻す場合はこのコメントアウトを外す
      <AuthLoading>
        <div className="p-8 text-slate-400">読み込み中...</div>
      </AuthLoading>
      <Unauthenticated>
        <SignIn />
      </Unauthenticated>
      <Authenticated>
        <App />
      </Authenticated>
      */}
      <App />
    </ConvexAuthProvider>
  </StrictMode>,
);
