import { cn } from "@/lib/utils";
import { XCircleIcon } from "lucide-react";
import Image from "next/image";

export default function UploadImagePreview({
  url,
  onRemove,
  allowPreviewRemove
}: {
  url: string;
  onRemove: () => void;
  allowPreviewRemove: boolean
}) {
  return (
    <div className="relative w-80 group">
      <Image
        src={url}
        alt="Uploaded image"
        style={{
          width: '100%',
          height: 'auto',
        }}
        width={500}
        height={800}
      />
      {
		allowPreviewRemove && <div
        className={cn(
          "absolute -top-2 -right-2 w-6 h-6 z-10 bg-gray-500 text-white rounded-full",
        )}
      >
        <XCircleIcon
          className="w-6 h-6 bg-gray-500 text-white rounded-full"
          onClick={onRemove}
        />
      </div>
	  }
    </div>
  );
}
