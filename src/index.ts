import { sftpOperations } from "./modules/sftp";
import { readSkudArray } from "./modules/jsonParser";

const fileName = `${__dirname}/data/SKUD.json`;

async function main() {
  // Пример: читаем массив JOURNAL
  let i = 0;
  for await (const journalItem of readSkudArray(fileName, "JOURNAL")) {
    //console.log("JOURNAL item:", journalItem);
    i++;
    if (i % 100000 === 0) {
      console.log(`I: ${i}`);
    }
  }
  console.log(i);
  // Можно аналогично для POINTS и STAFF
}

main();
