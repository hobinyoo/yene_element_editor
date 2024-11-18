export interface Element {
  id: string;
  type: "div" | "span" | "p";
  className: string;
  style?: {
    display?: string;
  };
  groupId?: string;
}

export interface Group {
  id: string;
  elementIds: string[];
}
