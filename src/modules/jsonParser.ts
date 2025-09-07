import * as fs from "fs";
import { parser } from "stream-json";
import { pick } from "stream-json/filters/Pick";
import { streamArray } from "stream-json/streamers/StreamArray";

/**
 * Асинхронный генератор для чтения массива из SKUD
 * @param filePath - путь к JSON
 * @param arrayName - имя массива внутри SKUD: JOURNAL | AccessPoints | STAFF
 */
export async function* readSkudArray(
  filePath: string,
  arrayName: "JOURNAL" | "AccessPoints" | "STAFF",
): AsyncGenerator<any> {
  const fileStream = fs.createReadStream(filePath);

  const pipeline = fileStream
    .pipe(parser())
    .pipe(pick({ filter: "SKUD" })) // сначала выбираем SKUD
    .pipe(pick({ filter: arrayName })) // потом нужный массив внутри SKUD
    .pipe(streamArray());

  for await (const { key, value } of pipeline) {
    yield value;
  }
}

/**
 * Вариант использования этой функции
 * const fileName = `${__dirname}/data/SKUD.json`;
 *
 * async function main() {
 *   // Пример: читаем массив JOURNAL
 *   let i = 0;
 *   for await (const journalItem of readSkudArray(fileName, "JOURNAL")) {
 *     //console.log("JOURNAL item:", journalItem);
 *     i++;
 *     if (i % 100000 === 0) {
 *       console.log(`I: ${i}`);
 *     }
 *   }
 *   console.log(i);
 *   // Можно аналогично для POINTS и STAFF
 * }
 */
