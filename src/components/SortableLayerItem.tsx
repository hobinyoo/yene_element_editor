import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Element } from "../types";

import clsx from "clsx";

interface SortableLayerItemProps {
  element: Element;
  isSelected: boolean;
  onSelect: (id: string, event: React.MouseEvent) => void;
}

export const SortableLayerItem: React.FC<SortableLayerItemProps> = ({
  element,
  isSelected,
  onSelect,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        "p-2 bg-white rounded cursor-move",
        isSelected && "border-2 border-blue-500",
        isDragging && "opacity-50"
      )}
      onClick={(e) => onSelect(element.id, e)}
    >
      {element.groupId ? "📁 " : ""}
      {element.type}
    </div>
  );
};
