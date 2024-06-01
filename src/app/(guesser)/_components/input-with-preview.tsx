import { Input } from "@/components/ui/input";
import UploadImagePreview from "@/components/upload-image-preview";

export default function InputWithPreview({
  imageUrl,
  guessState,
  onRemovePreviewImage,
  input,
  setInput,
}: {
  readonly imageUrl: string;
  readonly guessState: string;
  readonly onRemovePreviewImage: any;
  readonly input: string;
  readonly setInput: any;
}) {
  return (
    <div className="flex flex-col max-w-md p-2 mb-8 border border-gray-300 dark:border-gray-600 rounded shadow-xl">
      {imageUrl ? (
        <UploadImagePreview
          url={imageUrl}
          allowPreviewRemove={guessState === "image-uploaded"}
          onRemove={onRemovePreviewImage}
        />
      ) : (
        <></>
      )}
        <Input
          className="w-full p-2 focus-visible:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          value={input}
          placeholder="Add a hint if you have any ..."
          onChange={(e) => setInput(e.target.value)}
          maxLength={100}
        />
    </div>
  );
}
