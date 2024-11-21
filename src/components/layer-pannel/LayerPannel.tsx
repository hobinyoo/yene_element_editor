import { useEditor } from "context/editor-context";
import { AlignButtons } from "./AlignButtons";
import { ElementButtons } from "./ElementButtons";
import { SortableLayerItem } from "./SortableLayerItem";
import { DndContainer } from "components/dnd/DndContainer";

const LayerPannel = () => {
  const { elements, selectedIds, handleElementSelect } = useEditor();

  return (
    <aside className="w-64 bg-gray-100 p-4">
      <div className="space-y-4">
        <AlignButtons />
        <ElementButtons />
        <DndContainer layoutType="list">
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
        </DndContainer>
      </div>
    </aside>
  );
};

export default LayerPannel;
