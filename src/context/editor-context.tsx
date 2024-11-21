import React, { createContext, useContext, useReducer, ReactNode } from "react";
import clsx from "clsx";
import { arrayMove } from "@dnd-kit/sortable";
import { DragEndEvent } from "@dnd-kit/core";
import { BASE_STYLES } from "contants/styles";
import { Element, AlignDirection } from "types/element";
import { getRandomBgClass } from "lib/utils";
import { EditorState, EditorAction } from "types/editor";
import { nanoid } from "nanoid";

interface EditorContextType extends EditorState {
  createElement: (type: Element["type"]) => void;
  handleElementSelect: (id: string, event: React.MouseEvent) => void;
  handleDragStart: (event: DragEndEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  handleAlignGroup: (direction: AlignDirection) => void;
  handleAlignAll: (direction: AlignDirection) => void;
  createGroup: () => void;
  ungroup: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

const initialState: EditorState = {
  elements: [],
  selectedIds: [],
  activeId: null,
  layoutDirection: "horizontal",
};

function EditorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "CREATE_ELEMENT": {
      const newElement: Element = {
        id: nanoid(),
        type: action.payload.type,
        className: clsx(BASE_STYLES.container, getRandomBgClass()),
      };
      return { ...state, elements: [...state.elements, newElement] };
    }

    case "SET_SELECTED_IDS":
      return { ...state, selectedIds: action.payload };

    case "SET_ACTIVE_ID":
      return { ...state, activeId: action.payload };

    case "SET_LAYOUT_DIRECTION":
      return { ...state, layoutDirection: action.payload };

    case "CREATE_GROUP": {
      const remainingElements = state.elements.filter(
        (el) => !state.selectedIds.includes(el.id)
      );
      const firstSelectedIndex = state.elements.findIndex(
        (el) => el.id === state.selectedIds[0]
      );
      const newElements = [...remainingElements];
      newElements.splice(firstSelectedIndex, 0, {
        id: action.payload.groupId,
        type: "div",
        isGroup: true,
        elements: action.payload.selectedElements,
        className: clsx(BASE_STYLES.container, getRandomBgClass()),
        direction: "horizontal",
      });
      return {
        ...state,
        elements: newElements,
        selectedIds: [action.payload.groupId],
      };
    }
    case "UNGROUP": {
      const groupElement = action.payload;
      if (!groupElement?.isGroup || !groupElement.elements) return state;

      const groupIndex = state.elements.findIndex(
        (el) => el.id === groupElement.id
      );

      const remainingElements = state.elements.filter(
        (el) => el.id !== groupElement.id
      );

      const newElements = [...remainingElements];
      newElements.splice(groupIndex, 0, ...groupElement.elements);

      return {
        ...state,
        elements: newElements,
        selectedIds: groupElement.elements.map((el) => el.id),
      };
    }
    case "REORDER_ELEMENTS": {
      const oldIndex = state.elements.findIndex(
        (item) => item.id === action.payload.activeId
      );
      const newIndex = state.elements.findIndex(
        (item) => item.id === action.payload.overId
      );
      return {
        ...state,
        elements: arrayMove(state.elements, oldIndex, newIndex),
      };
    }

    case "SET_GROUP_DIRECTION":
      return {
        ...state,
        elements: state.elements.map((element) => {
          if (
            element.isGroup &&
            action.payload.selectedIds.includes(element.id)
          ) {
            return {
              ...element,
              direction: action.payload.direction,
            };
          }
          return element;
        }),
      };

    default:
      return state;
  }
}

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(EditorReducer, initialState);

  const createElement = (type: Element["type"]) => {
    dispatch({ type: "CREATE_ELEMENT", payload: { type } });
  };

  const handleElementSelect = (id: string, event: React.MouseEvent) => {
    if (event.shiftKey) {
      dispatch({
        type: "SET_SELECTED_IDS",
        payload: state.selectedIds.includes(id)
          ? state.selectedIds.filter((i) => i !== id)
          : [...state.selectedIds, id],
      });
    } else {
      dispatch({ type: "SET_SELECTED_IDS", payload: [id] });
    }
  };

  const handleDragStart = (event: DragEndEvent) => {
    dispatch({ type: "SET_ACTIVE_ID", payload: event.active.id as string });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      dispatch({
        type: "REORDER_ELEMENTS",
        payload: {
          activeId: active.id as string,
          overId: over.id as string,
        },
      });
    }
    dispatch({ type: "SET_ACTIVE_ID", payload: null });
  };

  const handleAlignGroup = (direction: AlignDirection) => {
    dispatch({
      type: "SET_GROUP_DIRECTION",
      payload: { selectedIds: state.selectedIds, direction },
    });
  };

  const handleAlignAll = (direction: AlignDirection) => {
    dispatch({ type: "SET_LAYOUT_DIRECTION", payload: direction });
  };

  const createGroup = () => {
    if (state.selectedIds.length < 2) return;

    const groupId = nanoid();
    const selectedElements = state.selectedIds.reduce<Element[]>(
      (acc, selectedId) => {
        const element = state.elements.find((el) => el.id === selectedId);
        if (element) {
          acc.push(element);
        }
        return acc;
      },
      []
    );
    dispatch({
      type: "CREATE_GROUP",
      payload: { groupId, selectedElements },
    });
  };

  const ungroup = () => {
    const groupElement = state.elements.find(
      (el) => el.isGroup && state.selectedIds.includes(el.id)
    );
    if (groupElement?.id) {
      dispatch({ type: "UNGROUP", payload: groupElement });
    }
  };

  return (
    <EditorContext.Provider
      value={{
        ...state,
        createElement,
        handleElementSelect,
        handleDragStart,
        handleDragEnd,
        handleAlignGroup,
        handleAlignAll,
        createGroup,
        ungroup,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within a EditorProvider");
  }
  return context;
}
