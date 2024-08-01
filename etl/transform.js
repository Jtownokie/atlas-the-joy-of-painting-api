// Transform extracted data into array of objects to be loaded into db
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';

let objectArray = []

// Function to read csv file
async function readCsvFile(filePath) {
  const data = await fs.readFile(filePath);
  return parse(data, { columns: true });
}

// Transform csv rows into JS Objects and add to array
async function transform() {
  // Read file
  const rows = await readCsvFile('../data/final_data.csv');

  // Convert rows into objects and return array of objects
  const objectArray = rows.map(row => {
    return {
      _id: row.Episode,
      title: row.Title,
      source: row.Source,
      month: row.Month,
      colors: JSON.parse(row.Colors.replace(/'/g, '"')),
      subjects: JSON.parse(row.Subjects.replace(/'/g, '"'))
    }
  });

  return objectArray;
}

// Execute the main function and export the result
export default await transform();
