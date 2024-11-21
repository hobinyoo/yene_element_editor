import clsx from "clsx";
import { Button } from "components/button/Button";
import { BUTTON_GROUPS } from "contants/button";
import { BUTTON_STYLES } from "contants/styles";
import { useEditor } from "context/editor-context";
import { ElementType } from "types/element";

export const ElementButtons = () => {
  const { createElement } = useEditor();
  const { title, items } = BUTTON_GROUPS.element;

  return (
    <div className="w-full">
      <p className="text-center font-bold">{title}</p>
      <div className="flex flex-col gap-y-1">
        {items.map(({ value, label }) => (
          <Button
            key={value}
            onClick={() => createElement(value as ElementType)}
            className={clsx(BUTTON_STYLES.base, BUTTON_STYLES.variants.element)}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};
