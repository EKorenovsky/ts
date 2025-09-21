import * as fs from "fs";
import * as mammoth from "mammoth";
import pdfParse from "pdf-parse";

const fsPromises = fs.promises;

// Асинхронное чтение TXT файла
const readTxtFileAsync = async (path: string): Promise<string> => {
  return await fsPromises.readFile(path, "utf-8");
};

// Для DOCX
const readDocxFile = async (path: string): Promise<string> => {
  const result = await mammoth.extractRawText({ path });
  return result.value;
};

// Для PDF (теперь тоже асинхронно)
const readPdfFile = async (path: string): Promise<string> => {
  const dataBuffer = await fsPromises.readFile(path);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
};

// Универсальная функция для чтения любого поддерживаемого файла
export const readInfoFile = async (filePath: string): Promise<string> => {
  const lowerCasePath = filePath.toLowerCase();
  if (lowerCasePath.endsWith(".txt")) {
    return await readTxtFileAsync(filePath);
  } else if (lowerCasePath.endsWith(".docx")) {
    return await readDocxFile(filePath);
  } else if (lowerCasePath.endsWith(".pdf")) {
    return await readPdfFile(filePath);
  } else {
    throw new Error("Неподдерживаемый тип файла");
  }
};

export const saveStringToTextFile = async (
  content: string,
  filePath: string,
): Promise<void> => {
  // Записываем содержимое в файл
  await fsPromises.writeFile(filePath, content, "utf-8");
};
