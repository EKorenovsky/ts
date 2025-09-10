import { readLargeJsonFile, readSmallJsonFile } from "./modules/jsonParser";
import { getBilling, getPoints, getSkud } from "./modules/modifySKUDData";

const fileNameSkud = `${__dirname}/data/SKUD_TEST_EASY.json`;
const fileNamePoints = `${__dirname}/data/felixMaster_public_SkudPointData.json`;
const fileNameBilling = `${__dirname}/data/felixMaster_public_SkudBillingData.json`;

async function main() {
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

  return newUserJournal;
}

main();
