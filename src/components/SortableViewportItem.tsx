import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Element } from "../types";
import clsx from "clsx";

interface SortableViewportItemProps {
  element: Element;
  isSelected: boolean;
  onSelect: (id: string, event: React.MouseEvent) => void;
}

export const SortableViewportItem: React.FC<SortableViewportItemProps> = ({
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
        element.className,
        "relative w-full h-[100px] flex items-center justify-center cursor-move",
        isSelected && "border-2 border-blue-500",
        isDragging && "opacity-50 shadow-lg shadow-black/10"
      )}
      onClick={(e) => onSelect(element.id, e)}
    >
      {element.type}
    </div>
  );
};
