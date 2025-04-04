import { google } from "googleapis";
import { Readable } from "stream";

const auth = new google.auth.GoogleAuth({
  keyFile: "src/Drive/clave.json",
  scopes: ["https://www.googleapis.com/auth/drive.file"],
});

const drive = google.drive({ version: "v3", auth });

const AREA_CARPETAS = {
  Pinturas: "1EVeSVsGL5KjWVduBnqcPdsJQPTzZby9R",
  Mecanica: "1veFgmEI0xDwB-K1qPkOro0OMNoe3YvNe"
};

const createFolderIfNotExists = async (folderName, parentId) => {
  try {
    // Buscar si la carpeta ya existe dentro del área
    const response = await drive.files.list({
      q: `'${parentId}' in parents and name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: "files(id, name)",
    });

    if (response.data.files && response.data.files.length > 0) {
      return response.data.files[0].id; // Retorna el ID de la carpeta existente
    }

    // Si no existe, crear la carpeta
    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    };

    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: "id",
    });

    return folder.data.id; // Retorna el ID de la nueva carpeta
  } catch (error) {
    console.error("Error al verificar/crear la carpeta:", error);
    throw new Error("No se pudo verificar o crear la carpeta en Google Drive");
  }
};

export const uploadFileToDrive = async (
  fileBuffer,
  fileName,
  area,
  substanceName,
  mimeType
) => {
  try {
    const areaFolderId = AREA_CARPETAS[area];
    if (!areaFolderId) throw new Error("No se encontró la carpeta del área");

    // Crear o verificar la carpeta de la sustancia dentro del área
    const substanceFolderId = await createFolderIfNotExists(substanceName, areaFolderId);

    // Convertir el archivo en un stream
    const fileStream = Readable.from(fileBuffer);

    // Subir el archivo dentro de la carpeta de la sustancia
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: [substanceFolderId],
      },
      media: {
        mimeType,
        body: fileStream,
      },
    });

    return response.data.id;
  } catch (error) {
    console.error("Error al subir a Drive:", error);
    throw new Error("No se pudo subir el archivo a Google Drive");
  }
};

export const deleteFileFromDrive = async (fileName, area, substanceName) => {
  try {
    const areaFolderId = AREA_CARPETAS[area];
    if (!areaFolderId) throw new Error("No se encontró la carpeta del área");

    // Obtener la carpeta de la sustancia dentro del área
    const substanceFolderId = await createFolderIfNotExists(substanceName, areaFolderId);

    // Buscar el archivo dentro de la carpeta de la sustancia
    const response = await drive.files.list({
      q: `'${substanceFolderId}' in parents and name='${fileName}' and trashed=false`,
      fields: "files(id, name)",
    });

    if (!response.data.files || response.data.files.length === 0) {
      throw new Error("No se encontró el archivo en Google Drive");
    }

    const fileId = response.data.files[0].id;

    // Eliminar el archivo
    await drive.files.delete({ fileId });

    return `Archivo '${fileName}' eliminado correctamente`;
  } catch (error) {
    console.error("Error al eliminar el archivo de Drive:", error);
    throw new Error("No se pudo eliminar el archivo de Google Drive");
  }
};