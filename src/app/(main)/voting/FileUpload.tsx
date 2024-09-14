
import { useUploadThing } from "@/lib/uploadthing";
import React, { useState } from 'react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      // Optionally, you could clear the selected file after upload
      setSelectedFile(null);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUploadClick}
        disabled={!selectedFile}
      >
        Upload
      </button>
      {selectedFile && <p>Selected file: {selectedFile.name}</p>}
    </div>
  );
};

export default FileUpload;
