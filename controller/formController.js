const csv = require('csv-parser');
const { Readable } = require('stream');

const processCsvBuffer = (buffer) => {
  const emails = [];
  const emailColumns = ['email', 'emails', 'mail', 'mails'];
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return new Promise((resolve, reject) => {
    Readable.from(buffer)
      .pipe(csv())
      .on('data', (row) => {
        const cleanedRow = {};
        for (let key in row) {
          cleanedRow[key.trim().toLowerCase()] = row[key].trim().toLowerCase();
        }

        for (const col of emailColumns) {
          if (cleanedRow[col] && emailRegex.test(cleanedRow[col])) {
            emails.push(cleanedRow[col]);
            break;
          }
        }
      })
      .on('end', () => resolve(emails))
      .on('error', reject);
  });
};



const formController = async (req, res) => {
  try {
    const { name, email, industry } = req.body;

    if (!name || !email || !industry) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const csvFile = req.file;
    if (!csvFile) {
      return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const emails = await processCsvBuffer(csvFile.buffer);
    console.log("Emails extracted from CSV:", emails);

    return res.status(200).json({
      message: 'Form submitted successfully!',
      formData: { name, email, industry },
      emails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred', error: error.message });
  }
};

module.exports = {formController};