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
    <section className="border border-gray-200 rounded-lg p-3 bg-gray-50">
      <h2 className="font-bold text-sm text-gray-600 mb-2 m-0">
        {title} <span className="text-xs font-normal">({items.length})</span>
      </h2>
      <div className="grid gap-2">
        {items.length === 0 ? (
          <div className="text-gray-400 text-sm">なし</div>
        ) : (
          items.map(children)
        )}
      </div>
    </section>
  );
}
