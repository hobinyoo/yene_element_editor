import clsx from "clsx";
import { Button } from "components/button/Button";
import { BUTTON_GROUPS } from "contants/button";
import { BUTTON_STYLES } from "contants/styles";
import { useEditor } from "context/editor-context";
import { AlignDirection } from "types/element";

export const AlignButtons = () => {
  const { handleAlignAll, handleAlignGroup } = useEditor();
  const { title, all, group } = BUTTON_GROUPS.align;

  return (
    <div className="w-full">
      <p className="text-center font-bold">{title}</p>
      <div className="flex flex-col gap-y-1">
        {all.map(({ value, label }) => (
          <Button
            key={value}
            onClick={() => handleAlignAll(value as AlignDirection)}
            className={clsx(BUTTON_STYLES.base, BUTTON_STYLES.variants.align)}
          >
            {label}
          </Button>
        ))}
        {group.map(({ value, label }) => (
          <Button
            key={value}
            onClick={() => handleAlignGroup(value as AlignDirection)}
            className={clsx(BUTTON_STYLES.base, BUTTON_STYLES.variants.align)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
