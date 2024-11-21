import { Element, AlignDirection } from "./element";

export interface EditorState {
  elements: Element[];
  selectedIds: string[];
  activeId: string | null;
  layoutDirection: AlignDirection;
}

export type EditorAction =
  | { type: "CREATE_ELEMENT"; payload: { type: Element["type"] } }
  | { type: "SET_SELECTED_IDS"; payload: string[] }
  | { type: "SET_ACTIVE_ID"; payload: string | null }
  | { type: "SET_LAYOUT_DIRECTION"; payload: AlignDirection }
  | {
      type: "CREATE_GROUP";
      payload: { groupId: string; selectedElements: Element[] };
    }
  | { type: "UNGROUP"; payload: Element }
  | { type: "REORDER_ELEMENTS"; payload: { activeId: string; overId: string } }
  | {
      type: "SET_GROUP_DIRECTION";
      payload: { selectedIds: string[]; direction: AlignDirection };
    };
