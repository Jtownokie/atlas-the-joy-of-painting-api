// Extract relevant data from files
import { promises as fs } from 'fs';
import { parse } from 'csv-parse/sync';
import { createObjectCsvWriter } from 'csv-writer';


// Function to read and parse a CSV file
async function readCsvFile(filePath) {
  const data = await fs.readFile(filePath);
  return parse(data, { columns: true });
}

// Function to read and parse the text file
async function readTextFile(filePath) {
  const data = await fs.readFile(filePath, 'utf-8');

  // Remove Empty Lines
  const lines = data.split('\n').filter(line => line.trim() !== '');

  // Return array of extracted months
  return lines.map(line => {
    const match = line.match(/\((\w+) \d+, \d+\)/);
    return match ? { month: match[1] } : null;
  }).filter(item => item !== null);
}

// Function to extract relevant data from colors_used.csv
function extractColorsUsedData(rows) {
  return rows.map(row => {
    // Remove surrounding quotes and parse the string into an array
    const colorsArray = JSON.parse(row.colors.replace(/'/g, '"'));

    // Clean each color name
    const cleanedColors = colorsArray.map(color => color.trim().replace(/[\r\n]+/g, ''));

    // Convert cleaned array back to the original string format
    const cleanedColorsString = `['${cleanedColors.join("','")}']`;

    return {
      title: row.painting_title,
      source: row.youtube_src,
      colors: cleanedColorsString
    };
  });
}

// Function to extract relevant data from subject_matter.csv
function extractSubjectMatterData(rows) {
  // Grab associated subject name if 1 is present in csv values
  // Then convert subject names into lowercase and capitalize the first letter
  return rows.map(row => {
    const episode = row.EPISODE;
    const subjects = Object.keys(row)
      .filter(key => key !== 'EPISODE' && row[key] === '1')
      .map(subject => subject.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()));
    return { episode, subjects };
  });
}

// Main Extraction function
async function extraction() {
  try {
    // Read and parse the CSV files and the text file
    const [colorsUsedData, subjectMatterData, episodeDatesData] = await Promise.all([
      readCsvFile('../data/JOP-colors_used.csv'),
      readCsvFile('../data/JOP-subject_matter.csv'),
      readTextFile('../data/JOP-episode_dates.txt')
    ]);

    // Extract relevant data
    const extractedColorsUsedData = extractColorsUsedData(colorsUsedData);
    const extractedSubjectMatterData = extractSubjectMatterData(subjectMatterData);

    // Combine the extracted data as needed
    const combinedData = extractedSubjectMatterData.map((subjectData, index) => {

      const colorsData = extractedColorsUsedData[index];
      const episodeDate = episodeDatesData[index];

      return {
        _id: subjectData.episode,
        title: colorsData.title,
        source: colorsData.source,
        month: episodeDate.month,
        colors: colorsData.colors,
        subjects: JSON.stringify(subjectData.subjects).replace(/"/g, "'")
      };
    });

    // Define the CSV writer
    const csvWriter = createObjectCsvWriter({
      path: '../data/final_data.csv',
      header: [
        { id: '_id', title: 'Episode' },
        { id: 'title', title: 'Title' },
        { id: 'source', title: 'Source' },
        { id: 'month', title: 'Month' },
        { id: 'colors', title: 'Colors' },
        { id: 'subjects', title: 'Subjects' }
      ],
      fieldDelimiter: ','
    });

    // Write the combined data to the new CSV file
    await csvWriter.writeRecords(combinedData);
    console.log('Extraction process completed successfully.');

  } catch (error) {
    console.error('Error during Extraction process:', error);
  }
}

extraction();
