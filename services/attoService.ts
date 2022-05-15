import fs from "fs";
import axios from "axios";
import { datesDifference, dateAddDays } from "../lib/helper-functions";
import { sleep } from "../lib/helper-functions";
import { Atto, Entries } from "../models/attoModel";

export const fetchMementoEntries = async (
  url: string,
  prevEntries: Entries = null,
  nextToken: string = null
): Promise<Entries> => {

  console.log("Fetching data from memento...");
  const originalUrl = url;
  if (nextToken) url = url + nextToken;

  const { data, status } = await axios.get<Entries>(url);

  if (status !== 200) throw new Error(`Error nella risposta. Status ${status}`);
  
  if (data.hasOwnProperty("nextPageToken")) {
    const nextPageToken = "&pageToken=" + data.nextPageToken;
    sleep(1000).then(() => console.log("Waited 1 second"));
    
    return fetchMementoEntries(originalUrl, data, nextPageToken);
  }

  let newEntries = data;
  
  if (prevEntries)
    newEntries.entries = [...prevEntries.entries, ...newEntries.entries];

  return newEntries;
};

export function readFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

export function writeFile(filePath: string, data: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, { flag: "w+" }, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

export function safeParseJSON(json: string): string[] | [] {
  try {
    return JSON.parse(json);
  } catch (e) {
    return [];
  }
}

export function safeParseAttiJSON(json: string): Atto[] | [] {
  try {
    return JSON.parse(json);
  } catch (e) {
    return [];
  }
}

export const filterOutOldEntries = (atti: Atto[]): Atto[] => {
  // filter out entries with stato 'in consegna' older than 30 days
  return atti.filter((atto) => {
    if (atto.stato === "In consegna") {
      const thirtyDaysFromConsegnato = dateAddDays(atto.dataConsegna, 30);
      const today = new Date();
      return datesDifference(today, thirtyDaysFromConsegnato) < 0;
    }
    return true;
  });
};
