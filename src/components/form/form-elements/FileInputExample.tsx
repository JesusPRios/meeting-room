import React from "react";
import ComponentCard from "../../common/ComponentCard";
import FileInput from "../input/FileInput";
import Label from "../Label";

interface FileInputProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInputExample: React.FC<FileInputProps> = ({ onFileChange }) => {

  return (
    <ComponentCard title="Campo de archivo">
      <div>
        <Label>Actualizar</Label>
        <FileInput onChange={onFileChange} className="custom-class" />
      </div>
    </ComponentCard>
  );
}

export default FileInputExample;