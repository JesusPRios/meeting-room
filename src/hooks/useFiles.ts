import { File } from "../types/Files";

export const Files = () => {

  const openFileInNewTab = (file: File) => {
    // If the file has no content, exit the function
    if (!file.content) return;
  
    // Decode the base64 content of the file
    const byteCharacters = atob(file.content);
    const byteArrays = [];
  
    // Convert the base64 string into byte arrays
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length).fill(0).map((_, i) => slice.charCodeAt(i));
      byteArrays.push(new Uint8Array(byteNumbers));
    }
  
    // Create a Blob from the byte arrays and generate a URL for it
    const blob = new Blob(byteArrays, { type: file.tipo_archivo });
    const url = URL.createObjectURL(blob);
    
    // Open the file in a new tab
    window.open(url, "_blank");
  };

  const openFilePreview = (file: File) => {
    openFileInNewTab(file);
  };

  // Function to download a file
  const downloadFile = (file: File) => {
    // If the file has no content, exit the function
    if (!file.content) return;

    // Decode the base64 content of the file
    const byteCharacters = atob(file.content);
    const byteArrays = [];

    // Convert the base64 string into byte arrays
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length).fill(0).map((_, i) => slice.charCodeAt(i));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    // Create a Blob from the byte arrays
    const blob = new Blob(byteArrays, { type: file.tipo_archivo });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = file.nombre_archivo; // Set the file name for the download
    link.click(); // Trigger the download by simulating a click on the link
  };

  return {
    openFileInNewTab,
    openFilePreview,
    downloadFile
  }
}

