import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Element } from "types/element";
import clsx from "clsx";

interface SortableLayerItemProps {
  element: Element;
  isSelected: boolean;
  onSelect: (id: string, event: React.MouseEvent) => void;
}

export const SortableLayerItem = ({
  element,
  isSelected,
  onSelect,
}: SortableLayerItemProps) => {
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

  if (element.isGroup) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={clsx(
          "bg-white rounded cursor-move border-2",
          isSelected ? " border-blue-500" : "border-gray-200",
          isDragging && "opacity-50"
        )}
        onClick={(e) => onSelect(element.id, e)}
      >
        <div className="p-2 bg-gray-50 border-b border-gray-200 font-medium">
          📁 Group
        </div>

        <div className="p-2 space-y-2">
          {element.elements?.map((childElement) => (
            <div
              key={childElement.id}
              className="pl-4 py-1 text-sm text-gray-600 border-l-2 border-gray-200"
            >
              {childElement.type}
            </div>
          ))}
        </div>
      </div>
    );
  }

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
      {element.type}
    </div>
  );
};
