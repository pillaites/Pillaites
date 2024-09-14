// Adjust the import path if necessary
import { useUploadThing } from "@/lib/uploadthing"; 

const FileUpload = () => {
  const { upload, isUploading } = useUploadThing();

  const handleUpload = async (file: File) => {
    try {
      await upload(file);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => e.target.files && handleUpload(e.target.files[0])} />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
};

export default FileUpload;
