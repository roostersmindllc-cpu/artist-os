import type { ReactNode } from "react";

type FieldHintProps = {
  children: ReactNode;
};

export function FieldHint({ children }: FieldHintProps) {
  return <p className="text-muted-foreground text-xs leading-5">{children}</p>;
}
