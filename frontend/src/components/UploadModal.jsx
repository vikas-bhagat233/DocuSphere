import { useState } from "react";

export default function UploadModal({ onUpload }) {
  const [file, setFile] = useState(null);

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={() => onUpload(file)}>Upload</button>
    </div>
  );
}