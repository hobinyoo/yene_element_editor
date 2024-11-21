import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Element } from "types/element";
import clsx from "clsx";

interface SortableViewportItemProps {
  element: Element;
  isSelected: boolean;
  onSelect: (id: string, event: React.MouseEvent) => void;
  layoutDirection?: "vertical" | "horizontal";
}

export const SortableViewportItem = ({
  element,
  isSelected = false,
  onSelect,
  layoutDirection = "horizontal",
}: SortableViewportItemProps) => {
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
    const colSpan = Math.min(element.elements?.length || 1, 7);
    return (
      <div
        ref={setNodeRef}
        style={{
          ...style,
          position: "relative",
          gridColumn:
            element.direction === "horizontal" ? `span ${colSpan}` : "span 1",
        }}
        {...attributes}
        {...listeners}
        className={clsx(
          "cursor-move focus:outline-none select-none",
          isDragging && "opacity-50 shadow-lg shadow-black/10"
        )}
        onClick={(e) => onSelect(element.id, e)}
      >
        <div
          className={clsx(
            "absolute -inset-2 border-2 pointer-events-none",
            isSelected ? " border-blue-500" : "border-dashed"
          )}
        />

        <div
          className={clsx(
            element.direction === "vertical"
              ? "flex flex-col gap-y-2"
              : "flex flex-row gap-x-2"
          )}
        >
          {element.elements?.map((childElement) => (
            <div
              key={childElement.id}
              className={clsx(
                childElement.className,
                "min-h-[100px] flex items-center justify-center w-full"
              )}
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
        element.className,
        "relative w-full h-[100px] flex items-center justify-center cursor-move focus:outline-none select-none",
        isSelected && "border-2 border-blue-500",
        isDragging && "opacity-50 shadow-lg shadow-black/10",
        layoutDirection === "vertical" && "col-start-1"
      )}
      onClick={(e) => onSelect(element.id, e)}
    >
      {element.type}
    </div>
  );
};
