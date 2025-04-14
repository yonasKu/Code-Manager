const fs = require('fs');
const path = require('path');

// Define the paths to the source files
const sourceFiles = [
  { path: path.join(__dirname, '../../USSDs/other/Africa.txt'), region: 'Africa' },
  { path: path.join(__dirname, '../../USSDs/other/asia.txt'), region: 'Asia' },
  { path: path.join(__dirname, '../../USSDs/other/europe.txt'), region: 'Europe' },
  { path: path.join(__dirname, '../../USSDs/other/NorthandSouthAmerica.txt'), region: 'Americas' },
  { path: path.join(__dirname, '../../USSDs/other/other.txt'), region: 'Other' }
];

// Define the output file path
const outputFile = path.join(__dirname, '../data/banks/all_banks.json');

// Function to process each source file
async function processSourceFile(sourceFile) {
  try {
    // Read the file content
    const fileContent = fs.readFileSync(sourceFile.path, 'utf8');
    
    // Parse the JSON content
    const countries = JSON.parse(fileContent);
    
    // Create a region object with the countries
    return {
      region: sourceFile.region,
      countries: countries
    };
  } catch (error) {
    console.error(`Error processing file ${sourceFile.path}:`, error);
    return null;
  }
}

// Main function to consolidate all bank data
async function consolidateBankData() {
  try {
    // Process all source files
    const regionsPromises = sourceFiles.map(processSourceFile);
    const regions = await Promise.all(regionsPromises);
    
    // Filter out any null results
    const validRegions = regions.filter(region => region !== null);
    
    // Write the consolidated data to the output file
    fs.writeFileSync(outputFile, JSON.stringify(validRegions, null, 2), 'utf8');
    
    console.log(`Successfully consolidated bank data to ${outputFile}`);
  } catch (error) {
    console.error('Error consolidating bank data:', error);
  }
}

// Run the consolidation
consolidateBankData();
