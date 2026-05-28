import type { ReactNode } from "react";
import type { CardType } from "../types";

type Props = {
  title: string;
  items: CardType[];
  children: (c: CardType) => ReactNode;
};

export function Column(props: Props) {
  const { title, items, children } = props;

  return (
    <section className="border border-slate-200 rounded-lg p-3 bg-slate-50/60">
      <h2 className="font-semibold text-xs text-slate-500 tracking-wide uppercase mb-3 m-0">
        {title} <span className="font-normal">({items.length})</span>
      </h2>
      <div className="grid gap-2">
        {items.length === 0 ? (
          <div className="text-slate-300 text-sm">なし</div>
        ) : (
          items.map(children)
        )}
      </div>
    </section>
  );
}
