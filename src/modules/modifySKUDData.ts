import { readSmallJsonFile } from "./jsonParser";
import { isArray } from "node:util";
import fs from "node:fs";

const fileNameSkud = `${__dirname}/data/SKUD_TEST_EASY.json`;
const fileNamePoints = `${__dirname}/data/felixMaster_public_SkudPointData.json`;
const fileNameBilling = `${__dirname}/data/felixMaster_public_SkudBillingData.json`;
const fileNameNew = `${__dirname}/data/SKUD_TEST_NEW.json`;

interface RootSkudData {
  SKUD: Skud;
}

interface Skud {
  AccessPoints: AccessPoint[];
  STAFF: Staff[];
  JOURNAL: Journal[];
}

interface AccessPoint {
  UIN: number;
  NAME: string;
}

interface Staff {
  UIN: number;
  FIO: string;
  DEPARTMENT: string;
  POSITION: string;
}

interface Journal {
  EVENT_TYPE: number;
  EVENT_DATETIME: string;
  UIN_ACCESSPOINT: number;
  UIN_PERSON: number;
}

const toIsoWithOffset = (input: string): string => {
  // Ожидаем: "YYYY-MM-DD HH:mm:ss.SSSSSS ±HH:MM"
  const m = input.match(
    /^(\d{4}-\d{2}-\d{2})\s(\d{2}:\d{2}:\d{2})\.(\d{6})\s([+-]\d{2}:\d{2})$/,
  );
  if (!m) throw new Error("Неверный формат времени");
  const [, date, time, micros, offset] = m;
  const ms = micros.slice(0, 3); // берём миллисекунды из микросекунд
  return `${date}T${time}.${ms}${offset}`;
};

export const getBilling = async (fileName: string) => {
  type BillingItem = {
    eventDate: string;
    eventType: number;
    skudPointId: number;
    [key: string]: unknown;
  };

  const billingData = await readSmallJsonFile<BillingItem[]>(fileName);
  if (Array.isArray(billingData)) {
    return billingData.map((item) => {
      return { ...item, eventDate: toIsoWithOffset(item.eventDate) };
    });
  }
  return [];
};

export const getPoints = async (fileName: string) => {
  const pointData = await readSmallJsonFile(fileName);
  const dicPoints: Record<string, string> = {};
  const dicPointsIds: Record<number, number> = {};
  if (pointData) {
    for (const point of pointData) {
      dicPoints[point?.["pointKey"]] = point?.["name"];
    }
    for (const point of pointData) {
      dicPointsIds[point?.["id"]] = point?.["pointKey"];
    }
  }
  const dataPoints = Object.keys(dicPoints).map((key) => {
    return { UIN: parseInt(key), NAME: dicPoints[key] };
  });
  return [dataPoints, dicPointsIds] as const;
};

export const getSkud = async (fileName: string) => {
  const dataSkud = await readSmallJsonFile<RootSkudData>(fileName);
  return dataSkud;
};

export async function modifySKUD() {
  const skud = await getSkud(fileNameSkud);
  const billingData = await getBilling(fileNameBilling);
  const [pointsData, dicPointIds] = await getPoints(fileNamePoints);

  const newPoints = pointsData.filter(
    (item) => skud.SKUD.AccessPoints.findIndex((p) => p.UIN === item.UIN) < 0,
  );

  skud.SKUD.AccessPoints = [...skud.SKUD.AccessPoints, ...newPoints];
  skud.SKUD.JOURNAL = [
    ...skud.SKUD.JOURNAL.filter((item) => item.UIN_PERSON !== 40955),
  ];

  const newUserJournal = billingData.map((item) => {
    return {
      EVENT_DATETIME: item.eventDate,
      EVENT_TYPE: item.eventType,
      UIN_PERSON: 40955,
      UIN_ACCESSPOINT: dicPointIds[item.skudPointId],
    };
  });
  skud.SKUD.JOURNAL = [...skud.SKUD.JOURNAL, ...newUserJournal];
  const jsonString = JSON.stringify(skud, null, 2);
  fs.writeFileSync(fileNameNew, jsonString);
  return newUserJournal;
}
