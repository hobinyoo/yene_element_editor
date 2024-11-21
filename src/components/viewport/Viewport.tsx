import { DownloadButton } from "components/button/DownloadButton";
import { useEditor } from "context/editor-context";
import { SortableViewportItem } from "./SortableViewportItem";
import { DndContainer } from "components/dnd/DndContainer";

const Viewport = () => {
  const { elements, selectedIds, layoutDirection, handleElementSelect } =
    useEditor();

  return (
    <section id="viewport" className="flex-1 p-4 bg-white">
      <DownloadButton />
      <DndContainer layoutType="grid">
        <div className="gap-4 auto-rows-min grid grid-cols-7">
          {elements.map((element) => (
            <SortableViewportItem
              key={element.id}
              element={element}
              isSelected={selectedIds.includes(element.id)}
              onSelect={handleElementSelect}
              layoutDirection={layoutDirection}
            />
          ))}
        </div>
      </DndContainer>
    </section>
  );
};

export default Viewport;
