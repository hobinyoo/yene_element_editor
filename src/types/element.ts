export type AlignDirection = "vertical" | "horizontal";
export type ElementType = "div" | "span" | "p";

export interface Element extends Partial<HTMLElement> {
  id: string;
  type: ElementType;
  elements?: Element[];
  isGroup?: boolean;
  direction?: AlignDirection;
  className?: string;
}
