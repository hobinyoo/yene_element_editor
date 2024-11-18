import React, { useState, useCallback, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Download } from "lucide-react";
import { Element, Group } from "./types";

import clsx from "clsx";
import { SortableLayerItem } from "./components/SortableLayerItem";
import { SortableViewportItem } from "./components/SortableViewportItem";

const elementStyles = {
  base: [
    "relative",
    "w-full",
    "h-[100px]",
    "flex",
    "items-center",
    "justify-center",
    "cursor-pointer",
  ],
  selected: "border-2 border-blue-500",
  dragging: "shadow-lg shadow-black/10",
} as const;

const LayerEditor: React.FC = () => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Element 생성 함수
  const createElement = useCallback((type: Element["type"]) => {
    const newElement: Element = {
      id: `element-${Date.now()}`,
      type,
      className: clsx(
        "w-[100px]",
        "h-[100px]",
        "m-[5px]",
        "border",
        "border-gray-300",
        getRandomTailwindClass()
      ),
    };
    setElements((prev) => [...prev, newElement]);
  }, []);

  // 랜덤 색상 생성
  const bgColors = [
    "bg-pink-200",
    "bg-sky-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-yellow-200",
  ];

  const getRandomTailwindClass = () => {
    return bgColors[Math.floor(Math.random() * bgColors.length)];
  };

  // 요소 선택 처리
  const handleElementSelect = useCallback(
    (id: string, event: React.MouseEvent) => {
      if (event.shiftKey) {
        setSelectedIds((prev) =>
          prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
      } else {
        setSelectedIds([id]);
      }
    },
    []
  );

  // 드래그 앤 드롭 처리
  const handleDragStart = (event: DragEndEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setElements((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    setActiveId(null);
  };

  // 정렬 처리
  const alignElements = useCallback(
    (type: "vertical" | "horizontal", groupOnly: boolean = false) => {
      setElements((prev) => {
        const newElements = [...prev];
        const targetElements = groupOnly
          ? newElements.filter(
              (el) => el.groupId && selectedIds.includes(el.groupId)
            )
          : selectedIds.length > 0
          ? newElements.filter((el) => selectedIds.includes(el.id))
          : newElements;

        targetElements.forEach((el) => {
          if (el.style) {
            el.style.display = type === "vertical" ? "block" : "inline-block";
          }
        });

        return newElements;
      });
    },
    [selectedIds]
  );

  // 그룹 처리
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "g" && !e.shiftKey) {
        e.preventDefault();
        if (selectedIds.length < 2) return;

        const groupId = `group-${Date.now()}`;
        const newGroup: Group = {
          id: groupId,
          elementIds: selectedIds,
        };

        setGroups((prev) => [...prev, newGroup]);
        setElements((prev) =>
          prev.map((el) =>
            selectedIds.includes(el.id) ? { ...el, groupId } : el
          )
        );
        setSelectedIds([groupId]);
      }

      if (e.ctrlKey && e.shiftKey && e.key === "G") {
        e.preventDefault();
        const selectedGroup = groups.find((g) => selectedIds.includes(g.id));
        if (!selectedGroup) return;

        setGroups((prev) => prev.filter((g) => g.id !== selectedGroup.id));
        setElements((prev) =>
          prev.map((el) =>
            selectedGroup.elementIds.includes(el.id)
              ? { ...el, groupId: undefined }
              : el
          )
        );
        setSelectedIds(selectedGroup.elementIds);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedIds, groups]);

  // 이미지 다운로드
  const handleDownload = useCallback(async () => {
    const viewport = document.getElementById("viewport");
    if (!viewport) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(viewport);
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "viewport-image.png";
      link.href = url;
      link.click();
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* 레이어 패널 */}
      <div className="w-64 bg-gray-100 p-4">
        <div className="space-y-4">
          {/* 정렬 버튼 */}
          <p className="text-center font-bold text-purple-400">Align</p>
          <div className="flex flex-col gap-y-1">
            <button
              onClick={() => alignElements("vertical")}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              전체 수직
            </button>
            <button
              onClick={() => alignElements("horizontal")}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              전체 수평
            </button>
            <button
              onClick={() => alignElements("vertical", true)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              그룹 수직
            </button>
            <button
              onClick={() => alignElements("horizontal", true)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              그룹 수평
            </button>
          </div>

          {/* Element 생성 버튼 */}
          <p className="text-center font-bold text-orange-400">Add</p>
          <div className="flex flex-col gap-y-1">
            <button
              onClick={() => createElement("div")}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              + div
            </button>
            <button
              onClick={() => createElement("span")}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              + span
            </button>
            <button
              onClick={() => createElement("p")}
              className="px-3 py-1 bg-blue-500 text-white rounded"
            >
              + p
            </button>
          </div>

          {/* 레이어 리스트 */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext
              items={elements.map((el) => el.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {elements.map((element) => (
                  <SortableLayerItem
                    key={element.id}
                    element={element}
                    isSelected={selectedIds.includes(element.id)}
                    onSelect={handleElementSelect}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* 뷰포트 */}
      <div id="viewport" className="flex-1 p-4 bg-white">
        <div className="mb-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center gap-2"
          >
            <Download size={16} />
            다운로드
          </button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <SortableContext
            items={elements.map((el) => el.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-5 gap-4 auto-rows-min">
              {elements.map((element) => (
                <SortableViewportItem
                  key={element.id}
                  element={element}
                  isSelected={selectedIds.includes(element.id)}
                  onSelect={handleElementSelect}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <div
                className={clsx(
                  elementStyles.base,
                  "bg-white border border-gray-300",
                  elementStyles.dragging
                )}
              >
                {elements.find((el) => el.id === activeId)?.type}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default LayerEditor;
