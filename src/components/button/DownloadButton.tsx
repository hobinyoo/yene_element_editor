import { Download } from "lucide-react";
import { Button } from "./Button";
import { BUTTON_STYLES } from "contants/styles";

export const DownloadButton = () => {
  const handleDownload = async () => {
    const element = document.getElementById("viewport");
    if (!element) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(element);
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "viewport-image.png";
      link.href = url;
      link.click();
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <div className="mb-4">
      <Button
        onClick={handleDownload}
        className={BUTTON_STYLES.variants.download}
      >
        <Download size={16} />
        다운로드
      </Button>
    </div>
  );
};
