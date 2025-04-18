import { generateReport } from '../utils/pdfGenerator.js';

export const downloadPDF = (req, res) => {
  const sampleData = ['User A', 'User B', 'User C'];
  const filePath = './report.pdf';
  generateReport(sampleData, filePath);

  res.download(filePath);
};
