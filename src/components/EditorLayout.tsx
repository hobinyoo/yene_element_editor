import React, { useEffect } from "react";
import { useEditor } from "../context/editor-context";
import LayerPannel from "./layer-pannel/LayerPannel";
import Viewport from "./viewport/Viewport";

const EditorLayout = () => {
  const { createGroup, ungroup } = useEditor();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "g" && !e.shiftKey) {
        e.preventDefault();
        createGroup();
      }

      if (e.ctrlKey && e.shiftKey && e.key === "G") {
        e.preventDefault();
        ungroup();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [createGroup, ungroup]);

  return (
    <main className="flex min-h-screen">
      <LayerPannel />
      <Viewport />
    </main>
  );
};

export default EditorLayout;
