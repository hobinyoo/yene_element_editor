import EditorLayout from "./components/EditorLayout";
import { EditorProvider } from "./context/editor-context";

export default function HomePage() {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
}
