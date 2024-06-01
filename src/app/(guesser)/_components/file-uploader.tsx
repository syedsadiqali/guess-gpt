"use client"

import { useUploadFile } from "@/hooks/use-upload-file"
import { FileUploader } from "@/components/file-uploader-new"
import { useEffect } from "react"

export default function FileUploaderComp({
	onFileUploadSuccess
}: {
	readonly onFileUploadSuccess: any
}) {
  const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] }
  )
  
  useEffect(() => {
	if(uploadedFiles) {
		onFileUploadSuccess(uploadedFiles)
	}
  }, [uploadedFiles])

  return (
    <div className="space-y-6">
      <FileUploader
        maxFiles={1}
        maxSize={4 * 1024 * 1024}
        progresses={progresses}
        onUpload={uploadFiles}
        disabled={isUploading}
      />
      {/* <UploadedFilesCard uploadedFiles={uploadedFiles} /> */}
    </div>
  )
}
