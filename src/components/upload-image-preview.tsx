import { cn } from "@/lib/utils";
import { XCircleIcon } from "lucide-react";
import Image from "next/image";

export default function UploadImagePreview({
  url,
  onRemove,
  allowPreviewRemove,
}: {
  url: string;
  onRemove: () => void;
  allowPreviewRemove: boolean;
}) {
  return (
    <div className="relative aspect-video w-64 group my-2 p-2 border">
      <Image
        src={url}
        alt={"Uploaded Image"}
        fill
        sizes="(min-width: 640px) 640px, 100vw"
        loading="lazy"
        className="rounded-md object-contain p-2"
      />
      {allowPreviewRemove && (
        <div
          className={cn(
            "absolute -top-2 -right-2 w-6 h-6 z-10 bg-gray-500 text-white rounded-full"
          )}
        >
          <XCircleIcon
            className="w-6 h-6 bg-gray-500 text-white rounded-full"
            onClick={onRemove}
          />
        </div>
      )}
    </div>
  );
}
