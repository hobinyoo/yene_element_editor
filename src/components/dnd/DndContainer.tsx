import {
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { ReactNode } from "react";
import clsx from "clsx";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { ELEMENT_STYLES } from "contants/styles";
import { useEditor } from "context/editor-context";
import { getSortingStrategy } from "lib/utils";

interface SharedDndContextProps {
  layoutType: "list" | "grid";
  children: ReactNode;
}

export const DndContainer = ({
  layoutType,
  children,
}: SharedDndContextProps) => {
  const { elements, activeId, handleDragStart, handleDragEnd } = useEditor();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 2,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext
        items={elements.map((el) => el.id)}
        strategy={getSortingStrategy(layoutType)}
      >
        {children}
      </SortableContext>

      {layoutType === "grid" && (
        <DragOverlay>
          {activeId ? (
            <div
              className={clsx(
                ELEMENT_STYLES.base,
                "bg-white border border-gray-300 h-[100px]",
                ELEMENT_STYLES.dragging
              )}
            >
              {elements.find((el) => el.id === activeId)?.type}
            </div>
          ) : null}
        </DragOverlay>
      )}
    </DndContext>
  );
};
