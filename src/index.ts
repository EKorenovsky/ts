import { checkAPI, checkAPITechSpec } from "./modules/deepSeekAPI";
import { readInfoFile, saveStringToTextFile } from "./modules/filesParser";

const localFilePath = `${__dirname}/data/Приложение_№5_ТЗ_Кислородная_станция_СЛ.pdf`;
const newFilePath = `${__dirname}/data/Приложение_№5_ТЗ_Кислородная_станция_СЛ.txt`;

async function main() {
  const txt = await readInfoFile(localFilePath);
  const d = await checkAPITechSpec(txt);
}

main();
