import { useState } from "react";

interface InputBoxProps {
  fetchDataFromGemini: (searchText: string) => Promise<void>;
  loading: boolean;
}

export default function FileUploader({ fetchDataFromGemini, loading }: InputBoxProps) {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      extractTextFromFile(file);
    }
  };

  const extractTextFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      console.log(text);
      setFileContent(text);
      fetchDataFromGemini(text);
    };

    if (file.type === "text/html") {
      reader.readAsText(file);
      console.log(reader.readAsText(file));
    } else if (file.type === "application/msword" || file.type === "application/vnd.ms-word") {
      // You need to use a library for .doc files
      reader.readAsBinaryString(file);
    } else if (file.type === "text/plain") {
      reader.readAsText(file); // For text files
    } else {
      // Handle other file types or show an error
      alert("Unsupported file type");
    }
  };

  return (
    <div className="w-[35%]">
      <input type="file" onChange={handleFileChange} />
    </div>
  );
}
